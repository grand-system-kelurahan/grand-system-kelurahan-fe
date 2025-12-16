import { useForm } from "react-hook-form";

import { useCreateLetterType } from "@/hooks/use-letter-types";
import {
  FormLetterTypeSchema,
  TLetterType,
} from "@/schemas/letter-type-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LetterTypeForm from "./letter-type-form";

export default function AddLetterTypeForm() {
  const form = useForm<TLetterType>({
    resolver: zodResolver(FormLetterTypeSchema),
    defaultValues: {},
  });

  const { mutateAsync, isPending } = useCreateLetterType();

  async function onSubmit(values: TLetterType) {
    console.log(values);

    const res = await mutateAsync(values);
    console.log(res);
  }

  return (
    <LetterTypeForm form={form} onSubmit={onSubmit} isLoading={isPending} />
  );
}
