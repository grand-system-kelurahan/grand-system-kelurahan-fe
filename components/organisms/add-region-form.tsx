import { useForm } from "react-hook-form";

import { useCreateRegion } from "@/hooks/use-regions";
import { FormRegionSchema, TRegion } from "@/schemas/region-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import RegionForm from "./region-form";

export default function AddRegionForm() {
  const form = useForm<TRegion>({
    resolver: zodResolver(FormRegionSchema),
    defaultValues: {},
  });

  const { mutateAsync, isPending } = useCreateRegion();

  async function onSubmit(values: TRegion) {
    await mutateAsync(values);
  }

  return <RegionForm form={form} onSubmit={onSubmit} isLoading={isPending} />;
}
