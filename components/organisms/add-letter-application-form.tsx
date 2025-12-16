import { useForm } from "react-hook-form";

import { useCreateLetterApplication } from "@/hooks/use-letter-applications";
import {
  FormLetterApplicationSchema,
  TLetterApplication,
} from "@/schemas/letter-application-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LetterApplicationForm from "./letter-application-form";

export default function AddLetterApplicationForm() {
  const form = useForm<TLetterApplication>({
    resolver: zodResolver(FormLetterApplicationSchema),
    defaultValues: {},
  });

  const { mutateAsync, isPending } = useCreateLetterApplication();

  async function onSubmit(values: TLetterApplication) {
    console.log(values);

    const res = await mutateAsync(values);
    console.log(res);
  }

  return (
    <>
      <LetterApplicationForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
      />
    </>
  );
}
