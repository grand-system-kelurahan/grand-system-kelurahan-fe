import { useForm } from "react-hook-form";

import { useCreateAssetLoan } from "@/hooks/use-asset-loans";
import { TAssetLoan, TCreateAssetLoan } from "@/schemas/asset-loan-schema";

import AssetLoanForm from "./asset-loan-form";

export default function AddAssetLoanForm() {
  const form = useForm<TAssetLoan>({
    defaultValues: {},
  });

  const { mutateAsync, isPending } = useCreateAssetLoan();

  async function onSubmit(values: TCreateAssetLoan) {
    await mutateAsync(values);
  }

  return (
    <AssetLoanForm form={form} onSubmit={onSubmit} isLoading={isPending} />
  );
}
