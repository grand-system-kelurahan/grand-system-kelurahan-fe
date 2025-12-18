import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useAssets } from "@/hooks/use-assets";
import { mapToOptions } from "@/lib/utils";
import { TAssetLoan } from "@/schemas/asset-loan-schema";
import { TAsset } from "@/schemas/asset-schema";
import { TResident } from "@/schemas/resident-schema";

import ButtonSave from "../atoms/button-save";
import FormSkeleton from "../molecules/form-skeleton";
import { InputCombobox } from "../molecules/input-combobox";
import { InputDate } from "../molecules/input-date";
import { InputNumber } from "../molecules/input-number";
import { InputText } from "../molecules/input-text";
import { InputTextarea } from "../molecules/input-text-area";
import SheetChoiceResident from "../molecules/sheet-choice-resident";
import { Label } from "../ui/label";

interface Props {
  form: UseFormReturn<TAssetLoan>;
  onSubmit: (values: TAssetLoan) => void;
  isLoading: boolean;
}

export default function AssetLoanForm({ form, isLoading, onSubmit }: Props) {
  const { data, isLoading: assetsLoading } = useAssets();
  const [resident, setResident] = useState<TResident | null>(null);

  const assetsData: TAsset[] = useMemo(() => data?.data, [data]);
  const assetOptions = mapToOptions(assetsData, "id", "asset_name");

  const selectedAssetId = form.watch("asset_id");

  function handleResidentChange(resident: TResident | null) {
    setResident(resident);
  }

  const selectedAsset = useMemo(() => {
    return assetsData?.find((asset) => asset.id === selectedAssetId);
  }, [assetsData, selectedAssetId]);

  useEffect(() => {
    if (resident) {
      form.setValue("resident_id", resident.id as number);
    }
  }, [resident, form]);

  return assetsLoading ? (
    <FormSkeleton columnCount={2} rowCount={3} />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-4">
          <InputCombobox
            control={form.control}
            name="asset_id"
            label="Jenis"
            placeholder="Jenis"
            isDisabled={isLoading}
            options={assetOptions}
          />
          <InputNumber
            control={form.control}
            name="quantity"
            label={
              selectedAsset
                ? `Kuantitas (Stok tersedia: ${selectedAsset.available_stock})`
                : "Kuantitas"
            }
            placeholder="Kuantitas"
            isDisabled={isLoading}
          />
          <InputDate
            control={form.control}
            name="loan_date"
            label="Tanggal Peminjaman"
            placeholder="Tanggal Peminjaman"
            isDisabled={isLoading}
          />
          <InputDate
            control={form.control}
            name="planned_return_date"
            label="Tanggal Pengembalian"
            placeholder="Tanggal Pengembalian"
            isDisabled={isLoading}
          />
          <InputTextarea
            control={form.control}
            name="loan_reason"
            label="Alasan Peminjaman"
            placeholder="Alasan peminjaman"
            isDisabled={isLoading}
            required
          />
          <div className="space-y-4">
            <Label>Pilih Penduduk</Label>
            <SheetChoiceResident
              resident={resident}
              onResidentChoice={handleResidentChange}
            />
          </div>
        </div>
        <ButtonSave isLoading={isLoading} />
      </form>
    </Form>
  );
}
