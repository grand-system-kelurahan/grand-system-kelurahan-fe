import { useDeleteResident } from "@/hooks/use-residents";
import { TResident } from "@/schemas/resident-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  resident: TResident;
}

export default function DeleteResidentForm({ resident }: Props) {
  const { isPending, mutateAsync } = useDeleteResident();

  async function onSubmit() {
    await mutateAsync(resident.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
