import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { TUser } from "@/schemas/user-schema";
import { TSelectOption } from "@/types/types";

import ButtonSave from "../atoms/button-save";
import { InputSelect } from "../molecules/input-select";
import { InputText } from "../molecules/input-text";

interface LingkunganFormProps {
  form: UseFormReturn<TUser>;
  onSubmit: (values: TUser) => void;
  isLoading: boolean;
}

export default function UserForm({
  form,
  isLoading,
  onSubmit,
}: LingkunganFormProps) {
  const roleOptions: TSelectOption[] = [
    { value: "admin", label: "Admin" },
    { value: "pegawai", label: "Pegawai" },
    { value: "user", label: "Masyarakat" },
  ];
  return (
    <Form {...form}>
      <pre>{JSON.stringify(form.formState.errors)}</pre>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputText
          control={form.control}
          name="name"
          label="Nama"
          placeholder="Nama"
          isDisabled={isLoading}
        />
        <InputText
          control={form.control}
          name="email"
          label="Email"
          placeholder="Email"
          isDisabled={true}
        />
        <InputText
          control={form.control}
          name="username"
          label="Username"
          placeholder="Username"
          isDisabled={true}
        />
        <InputSelect
          control={form.control}
          name="role"
          label="Peran"
          placeholder="Peran"
          isDisabled={isLoading}
          options={roleOptions}
        />
        <ButtonSave isLoading={isLoading} />
      </form>
    </Form>
  );
}
