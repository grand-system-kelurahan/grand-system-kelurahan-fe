import { useDeleteRegion } from "@/hooks/use-regions";
import { TRegion } from "@/schemas/region-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  region: TRegion;
}

export default function DeleteRegionRorm({ region }: Props) {
  const { isPending, mutateAsync } = useDeleteRegion();

  async function onSubmit() {
    await mutateAsync(region.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
