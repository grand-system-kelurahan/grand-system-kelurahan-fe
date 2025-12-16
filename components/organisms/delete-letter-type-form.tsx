import { useDeleteLetterType } from "@/hooks/use-letter-types";
import { TLetterType } from "@/schemas/letter-type-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  letterType: TLetterType;
}

export default function DeleteLetterTypeForm({ letterType }: Props) {
  const { isPending, mutateAsync } = useDeleteLetterType();

  async function onSubmit() {
    await mutateAsync(letterType.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
