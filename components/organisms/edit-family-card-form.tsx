import { useForm } from "react-hook-form";

import { useUpdateFamilyCard } from "@/hooks/use-family-cards";
import {
  FormFamilyCardSchema,
  TFamilyCard,
} from "@/schemas/family-card-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import FamilyCardForm from "./family-card-form";

interface Props {
  familyCard: TFamilyCard;
  isLoading?: boolean;
}

export default function EditFamilyCardForm({ familyCard, isLoading }: Props) {
  const { mutateAsync, isPending } = useUpdateFamilyCard();

  const form = useForm<TFamilyCard>({
    resolver: zodResolver(FormFamilyCardSchema),
    defaultValues: {
      address: familyCard.address,
      head_of_family_name: familyCard.head_of_family_name,
      publication_date: new Date(familyCard.publication_date),
      region_id: familyCard.region_id,
      id: familyCard.id,
    },
  });

  async function onSubmit(values: TFamilyCard) {
    await mutateAsync({
      id: familyCard.id as number,
      payload: values,
    });
  }

  return (
    <FamilyCardForm form={form} onSubmit={onSubmit} isLoading={isPending} />
  );
}
