import { useForm } from "react-hook-form";

import { useCreateResident } from "@/hooks/use-residents";
import { FormResidentSchema, TResident } from "@/schemas/resident-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import ResidentForm from "./resident-form";

export default function AddResidentForm() {
  const { mutateAsync, isPending } = useCreateResident();

  const form = useForm<TResident>({
    resolver: zodResolver(FormResidentSchema),
    defaultValues: {},
  });

  async function onSubmit(values: TResident) {
    await mutateAsync(values);
  }

  return (
    <>
      <ResidentForm form={form} onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
