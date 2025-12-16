import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useLetterTypes } from "@/hooks/use-letter-types";
import { mapToOptions } from "@/lib/utils";
import { TLetterApplication } from "@/schemas/letter-application-schema";
import { TLetterType } from "@/schemas/letter-type-schema";
import { TResident } from "@/schemas/resident-schema";
import { TSelectOption } from "@/types/types";

import ButtonSave from "../atoms/button-save";
import FormSkeleton from "../molecules/form-skeleton";
import { InputSelect } from "../molecules/input-select";
import { InputTextarea } from "../molecules/input-text-area";
import SheetChoiceResident from "../molecules/sheet-choice-resident";
import { Label } from "../ui/label";

interface Props {
  form: UseFormReturn<TLetterApplication>;
  onSubmit: (values: TLetterApplication) => void;
  isLoading: boolean;
}

export default function LetterApplicationForm({
  form,
  isLoading: initLoading,
  onSubmit,
}: Props) {
  const { data, isLoading: isLoadingLetterTypes, refetch } = useLetterTypes();
  const [resident, setResident] = useState<TResident | null>(null);
  const letterTypesData: TLetterType[] = useMemo(
    () => data?.data?.letterType || [],
    [data]
  );

  const letterTypeOptions: TSelectOption[] = mapToOptions(
    letterTypesData,
    "id",
    "letter_name"
  );

  function handleResidentChange(resident: TResident | null) {
    setResident(resident);
  }

  useEffect(() => {
    if (resident) {
      form.setValue("resident_id", resident.id);
    }
  }, [resident, form]);

  const isLoading = initLoading || isLoadingLetterTypes;

  return (
    <>
      {isLoadingLetterTypes ? (
        <FormSkeleton columnCount={1} rowCount={3} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputSelect
              control={form.control}
              name="letter_type_id"
              label="Pilih Jenis Surat"
              placeholder="Pilih jenis surat"
              isDisabled={isLoading}
              options={letterTypeOptions}
            />
            <InputTextarea
              control={form.control}
              name="description"
              label="Keperluan Mencari Surat"
              placeholder="Keperluan mencari surat"
              isDisabled={isLoading}
            />
            <Label>Pilih Penduduk</Label>
            <SheetChoiceResident
              resident={resident}
              onResidentChoice={handleResidentChange}
            />
            <ButtonSave isLoading={isLoading} />
          </form>
        </Form>
      )}
    </>
  );
}
