"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-login";
import { FormLoginSchema, TLogin } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingIcon from "./atoms/loading-icon";
import { InputText } from "./molecules/input-text";
import { Form } from "./ui/form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { isPending, mutateAsync } = useLogin();

  const form = useForm<TLogin>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TLogin) {
    try {
      const response = await mutateAsync({
        username: values.username,
        password: values.password,
      });

      if (response.success) {
        const token = response?.data?.token;
        if (!token) {
          toast.error("Gagal masuk, token tidak ditemukan");
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
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
          <InputText
            control={form.control}
            name="username"
            label="Username"
            placeholder="Username"
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <LoadingIcon />
                Proses
              </>
            ) : (
              <>
                <LogIn /> Masuk
              </>
            )}
          </Button>
        </form>
      </Form>
      <p className="mt-4 text-muted-foreground text-sm">
        Belum punya akun?{" "}
        <Link href={"/signup"} className="hover:underline">
          Daftar
        </Link>
      </p>
    </>
  );
}
