import { toast } from "sonner";

import { TLogin, TRegister } from "@/schemas/auth-schema";
import { login, register } from "@/services/auth-service";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: TLogin) => login(payload),
    onSuccess: (_, variables) => {
      toast.success("Berhasil Login");
    },
    onError: (error) => {
      toast.error("Gagal login");
      console.error("Error updating data:", error);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: TRegister) => register(payload),
    onSuccess: (_, variables) => {
      toast.success("Berhasil membuat akun");
    },
    onError: (error) => {
      toast.error("Gagal membuat akun");
      console.error("Error updating data:", error);
    },
  });
}
