import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useRegions } from "@/hooks/use-regions";
import { mapToOptions } from "@/lib/utils";
import { TFamilyCard } from "@/schemas/family-card-schema";
import { TRegion } from "@/schemas/region-schema";

import ButtonSave from "../atoms/button-save";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import FormSkeleton from "../molecules/form-skeleton";
import { InputDate } from "../molecules/input-date";
import { InputSelect } from "../molecules/input-select";
import { InputText } from "../molecules/input-text";

interface Props {
  form: UseFormReturn<TFamilyCard>;
  onSubmit: (values: TFamilyCard) => void;
  isLoading: boolean;
}

export default function FamilyCardForm({ form, isLoading, onSubmit }: Props) {
  const { data, isLoading: isLoadingLingkungan } = useRegions();
  const regionsData: TRegion[] = useMemo(
    () => data?.data?.regions || [],
    [data?.data]
  );
  const lingkunganOptions = mapToOptions(regionsData, "id", "name");

  return (
    <>
      {isLoadingLingkungan ? (
        <FormSkeleton columnCount={2} rowCount={2} />
      ) : (
        <Form {...form}>
          <div className="flex gap-2 my-5">
            {data && <CodeEditorDialog content={data} text="Data Lingkungan" />}
            <CodeEditorDialog content={form.watch()} text="Data terkirim" />
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <InputText
                control={form.control}
                name="head_of_family_name"
                label="Nama Kepala Keluarga"
                placeholder="Nama kepala keluarga"
                isDisabled={isLoading}
              />
              <InputText
                control={form.control}
                name="address"
                label="Alamat"
                placeholder="Alamat"
                isDisabled={isLoading}
              />
              <InputDate
                control={form.control}
                name="publication_date"
                label="Tanggal Penerbitan"
                placeholder="Tanggal penerbitan"
                isDisabled={isLoading}
              />
              <InputSelect
                control={form.control}
                name="region_id"
                label="Lingkungan"
                placeholder="Lingkungan"
                isDisabled={isLoading}
                options={lingkunganOptions}
              />
            </div>

            <ButtonSave isLoading={isLoading} />
          </form>
        </Form>
      )}
    </>
  );
}
