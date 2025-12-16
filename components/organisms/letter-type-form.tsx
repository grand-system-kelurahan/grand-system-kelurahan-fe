import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { TLetterType } from "@/schemas/letter-type-schema";

import ButtonSave from "../atoms/button-save";
import { InputText } from "../molecules/input-text";
import { InputTextarea } from "../molecules/input-text-area";

interface Props {
  form: UseFormReturn<TLetterType>;
  onSubmit: (values: TLetterType) => void;
  isLoading: boolean;
}

export default function LetterTypeForm({ form, isLoading, onSubmit }: Props) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputText
          control={form.control}
          name="letter_code"
          label="Kode"
          placeholder="Kode"
          isDisabled={isLoading}
        />
        <InputText
          control={form.control}
          name="letter_name"
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

        <ButtonSave isLoading={isLoading} />
      </form>
    </Form>
  );
}
