import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { TAsset } from "@/schemas/asset-schema";
import { TSelectOption } from "@/types/types";

import ButtonSave from "../atoms/button-save";
import { InputNumber } from "../molecules/input-number";
import { InputSelect } from "../molecules/input-select";
import { InputText } from "../molecules/input-text";
import { InputTextarea } from "../molecules/input-text-area";

interface LingkunganFormProps {
  form: UseFormReturn<TAsset>;
  onSubmit: (values: TAsset) => void;
  isLoading: boolean;
}

export default function AssetForm({
  form,
  isLoading,
  onSubmit,
}: LingkunganFormProps) {
  const assetTypeOptions: TSelectOption[] = [
    {
      label: "Barang",
      value: "item",
    },
    {
      label: "Tempat",
      value: "room",
    },
  ];

  const assetStatusOptions: TSelectOption[] = [
    {
      label: "Aktif",
      value: "active",
    },
    {
      label: "Tidak Aktif",
      value: "inactive",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <InputText
            control={form.control}
            name="asset_code"
            label="Kode"
            placeholder="Kode"
            isDisabled={isLoading}
          />
          <InputText
            control={form.control}
            name="asset_name"
            label="Nama"
            placeholder="Nama"
            isDisabled={isLoading}
          />
          <InputTextarea
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Deskripsi"
            isDisabled={isLoading}
          />
          <InputTextarea
            control={form.control}
            name="location"
            label="Lokasi"
            placeholder="Lokasi"
            isDisabled={isLoading}
          />
          <InputSelect
            control={form.control}
            name="asset_type"
            label="Jenis"
            placeholder="Jenis"
            isDisabled={isLoading}
            options={assetTypeOptions}
          />
          <InputNumber
            control={form.control}
            name="total_stock"
            label="Total Stok"
            placeholder="Total Stok"
            isDisabled={isLoading}
          />
          <InputNumber
            control={form.control}
            name="available_stock"
            label="Stok Tersedia"
            placeholder="Stok tersedia"
            isDisabled={isLoading}
          />
          <InputSelect
            control={form.control}
            name="asset_status"
            label="Status"
            placeholder="Status"
            isDisabled={isLoading}
            options={assetStatusOptions}
          />
        </div>

        <ButtonSave isLoading={isLoading} />
      </form>
    </Form>
  );
}
