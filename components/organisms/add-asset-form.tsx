import { useForm } from "react-hook-form";

import { useCreateAsset } from "@/hooks/use-assets";
import { FormAssetSchema, TAsset } from "@/schemas/asset-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import AssetForm from "./asset-form";

export default function AddAssetForm() {
  const form = useForm<TAsset>({
    resolver: zodResolver(FormAssetSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useCreateAsset();

  async function onSubmit(values: TAsset) {
    mutate(values);
  }

  return (
    <AssetForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
    />
  );
}
