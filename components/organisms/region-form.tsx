import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { TRegion } from "@/schemas/region-schema";

import ButtonSave from "../atoms/button-save";
import { InputText } from "../molecules/input-text";

interface LingkunganFormProps {
  form: UseFormReturn<TRegion>;
  onSubmit: (values: TRegion) => void;
  isLoading: boolean;
}

export default function RegionForm({
  form,
  isLoading,
  onSubmit,
}: LingkunganFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputText
          control={form.control}
          name="name"
          label="Nama Lingkungan"
          placeholder="Nama lingkungan"
          isDisabled={isLoading}
        />
        <InputText
          control={form.control}
          name="encoded_geometry"
          label="Geometri sementara"
          placeholder="Geometri sementara"
          isDisabled={isLoading}
        />

        <ButtonSave isLoading={isLoading} />
      </form>
    </Form>
  );
}
