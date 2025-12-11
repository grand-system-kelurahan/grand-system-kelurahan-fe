import { useForm } from "react-hook-form";

import { useUpdateRegion } from "@/hooks/use-regions";
import { FormRegionSchema, TRegion } from "@/schemas/region-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import RegionForm from "./region-form";

interface Props {
  region: TRegion;
}

export default function EditRegionForm({ region }: Props) {
  const form = useForm<TRegion>({
    resolver: zodResolver(FormRegionSchema),
    defaultValues: {
      name: region.name,
      encoded_geometry: region.encoded_geometry,
    },
  });

  const { mutate, isPending } = useUpdateRegion();

  async function onSubmit(values: TRegion) {
    mutate({
      id: region.id as number,
      payload: values,
    });
  }

  return <RegionForm form={form} onSubmit={onSubmit} isLoading={isPending} />;
}
