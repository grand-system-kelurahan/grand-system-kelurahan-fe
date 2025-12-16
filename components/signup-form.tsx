"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";
import { FormRegisterSchema, TRegister } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingIcon from "./atoms/loading-icon";
import { InputText } from "./molecules/input-text";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { isPending, mutateAsync } = useRegister();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const form = useForm<TRegister>({
    resolver: zodResolver(FormRegisterSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TRegister) {
    if (values.password != passwordConfirmation) {
      toast.error("Password tidak sesuai");
      return;
    }

    if (values.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    try {
      const response = await mutateAsync({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        const token = response?.data?.token;
        if (!token) {
          toast.error("Gagal membuat akun, token tidak ditemukan");
        }
        localStorage.setItem("token", token);
        form.reset();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-bold text-2xl">Daftar akun Baru</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Silahkan isi data berikut untuk mendaftar sebagai akun baru.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
          <InputText
            control={form.control}
            name="name"
            label="Nama Lengkap"
            placeholder="Nama Lengkap"
            isDisabled={isPending}
          />
          <InputText
            control={form.control}
            name="username"
            label="Username"
            placeholder="Username"
            isDisabled={isPending}
          />
          <InputText
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            isDisabled={isPending}
          />
          <InputText
            control={form.control}
            name="password"
            label="Password"
            placeholder="Password"
            isDisabled={isPending}
            type="password"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-1 w-full">
              <Label>Konfirmasi Password</Label>
              <p className="text-red-500">*</p>
            </div>
            <Input
              type="password"
              value={passwordConfirmation}
              placeholder="Konfirmasi password"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <LoadingIcon />
                Proses
              </>
            ) : (
              <>
                <LogIn /> Daftar Akun
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-muted-foreground text-sm">
        Sudah punya akun?{" "}
        <Link href={"/login"} className="hover:underline">
          Masuk
        </Link>
      </p>
    </>
  );
}
