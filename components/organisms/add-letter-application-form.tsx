import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useCreateLetterApplication } from "@/hooks/use-letter-applications";
import { useUserLogin } from "@/hooks/use-users";
import {
  FormLetterApplicationSchema,
  TLetterApplication,
} from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LetterApplicationForm from "./letter-application-form";

export default function AddLetterApplicationForm() {
  const { mutateAsync, isPending } = useCreateLetterApplication();
  const { data, isLoading } = useUserLogin();
  const router = useRouter();
  const userData: TUser = useMemo(() => data, [data]);

  if (!isLoading && !userData) {
    router.push("/login");
  }

  const form = useForm<TLetterApplication>({
    resolver: zodResolver(FormLetterApplicationSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TLetterApplication) {
    console.log(values);

    const res = await mutateAsync(values);
    console.log(res);
  }

  useEffect(() => {
    if (userData) {
      form.setValue("submitted_by", userData.id as number);
    }
  }, [userData, form]);

  return (
    <>
      <LetterApplicationForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending || isLoading}
      />
    </>
  );
}
