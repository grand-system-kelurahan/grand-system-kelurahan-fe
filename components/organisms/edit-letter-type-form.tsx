import { useForm } from "react-hook-form";

import { useUpdateLetterType } from "@/hooks/use-letter-types";
import {
  FormLetterTypeSchema,
  TLetterType,
} from "@/schemas/letter-type-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import LetterTypeForm from "./letter-type-form";

interface Props {
  letterType: TLetterType;
}

export default function EditLetterTypeForm({ letterType }: Props) {
  const form = useForm<TLetterType>({
    resolver: zodResolver(FormLetterTypeSchema),
    defaultValues: {
      letter_code: letterType.letter_code,
      letter_name: letterType.letter_name,
      description: letterType.description,
    },
  });

  const { mutate, isPending } = useUpdateLetterType();

  async function onSubmit(values: TLetterType) {
    mutate({
      id: letterType.id as number,
      payload: values,
    });
  }

  return (
    <LetterTypeForm form={form} onSubmit={onSubmit} isLoading={isPending} />
  );
}
