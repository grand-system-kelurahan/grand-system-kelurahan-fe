"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { FormLoginSchema, TLogin } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingIcon from "./atoms/loading-icon";
import { InputText } from "./molecules/input-text";
import { Form } from "./ui/form";

export function LoginForm(props: React.ComponentProps<"form">) {
  const { isPending, mutateAsync } = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<TLogin>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TLogin) {
    try {
      await mutateAsync({ username: values.username, password: values.password });

      form.reset();

      const next = searchParams?.get("next");
      if (next && next.startsWith("/")) router.replace(next);
      else router.replace("/");
    } catch (err: any) {
      toast.error(err?.message ?? "Login gagal");
      console.error(err);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-bold text-2xl">Selamat Datang Kembali</h1>
        <p className="text-muted-foreground text-sm text-balance">Masuk untuk melanjutkan</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8" {...props}>
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
