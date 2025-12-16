import { useForm } from "react-hook-form";

import { useUpdateAsset } from "@/hooks/use-assets";
import { FormAssetSchema, TAsset } from "@/schemas/asset-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import AssetForm from "./asset-form";

interface Props {
  asset: TAsset;
}

export default function EditAssetForm({ asset }: Props) {
  const form = useForm<TAsset>({
    resolver: zodResolver(FormAssetSchema),
    defaultValues: {
      asset_code: asset.asset_code,
      asset_name: asset.asset_name,
      asset_status: asset.asset_status,
      asset_type: asset.asset_type,
      available_stock: asset.available_stock,
      description: asset.description,
      id: asset.id,
      location: asset.location,
      total_stock: asset.total_stock,
    },
  });

  const { mutate, isPending } = useUpdateAsset();

  async function onSubmit(values: TAsset) {
    console.log(values);

    const res = mutate({
      id: asset.id as number,
      payload: values,
    });
    console.log(res);
  }

  return (
    <AssetForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
    />
  );
}
