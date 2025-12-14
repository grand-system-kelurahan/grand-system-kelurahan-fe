import { useDeleteFamilyCard } from "@/hooks/use-family-cards";
import { TFamilyCard } from "@/schemas/family-card-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  familyCard: TFamilyCard;
}

export default function DeleteFamilyCardRorm({ familyCard }: Props) {
  const { isPending, mutateAsync } = useDeleteFamilyCard();

  async function onSubmit() {
    await mutateAsync(familyCard.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
