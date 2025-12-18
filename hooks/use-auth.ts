"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import type { TLogin, TRegister } from "@/schemas/auth-schema";
import { login, logout, register, checkUserLogin } from "@/services/auth-service";

type Role = "admin" | "pegawai" | "user";

function isSecure() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${
    isSecure() ? "; Secure" : ""
  }`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function clearAuthCookies() {
  clearCookie("token");
  clearCookie("role");
  clearCookie("user");
}

function extractToken(res: any): string | null {
  return res?.data?.token ?? res?.token ?? res?.access_token ?? res?.data?.access_token ?? null;
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: TLogin) => login(payload),
    onSuccess: async (res) => {
      if (!res?.success) throw new Error(res?.message ?? "Login gagal");

      const token = extractToken(res);
      if (!token) throw new Error("Token tidak ditemukan dari response /login");

      setCookie("token", token, 7);

      const me = await checkUserLogin();

      const role = (me?.role ?? "user") as Role;
      setCookie("role", role, 7);
      setCookie("user", JSON.stringify(me ?? {}), 7);

      toast.success("Berhasil Login");
    },
    onError: (error) => {
      toast.error("Gagal login");
      console.error("Error login:", error);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: TRegister) => register(payload),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Berhasil membuat akun");
      router.push("/login");
    },
    onError: (error) => {
      toast.error("Gagal membuat akun");
      console.error("Error register:", error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearAuthCookies();
      toast.success("Berhasil keluar");
      router.push("/login");
    },
    onError: (error) => {
      clearAuthCookies();
      toast.error("Gagal keluar");
      console.error("Error logout:", error);
      router.push("/login");
    },
  });
}
