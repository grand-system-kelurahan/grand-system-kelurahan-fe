import { useDeleteAsset } from "@/hooks/use-assets";
import { TAsset } from "@/schemas/asset-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  asset: TAsset;
}

export default function DeleteAssetForm({ asset }: Props) {
  const { isPending, mutateAsync } = useDeleteAsset();

  async function onSubmit() {
    await mutateAsync(asset.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
