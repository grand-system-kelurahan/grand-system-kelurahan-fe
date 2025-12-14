import { useForm } from "react-hook-form";

import { useCreateFamilyCard } from "@/hooks/use-family-cards";
import {
  FormFamilyCardSchema,
  TFamilyCard,
} from "@/schemas/family-card-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import FamilyCardForm from "./family-card-form";

export default function AddFamilyCardForm() {
  const { mutateAsync, isPending } = useCreateFamilyCard();

  const form = useForm<TFamilyCard>({
    resolver: zodResolver(FormFamilyCardSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TFamilyCard) {
    await mutateAsync(values);
  }

  return (
    <FamilyCardForm form={form} onSubmit={onSubmit} isLoading={isPending} />
  );
}
