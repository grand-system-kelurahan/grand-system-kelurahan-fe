import { useForm } from "react-hook-form";

import { useUpdateResident } from "@/hooks/use-residents";
import { FormResidentSchema, TResident } from "@/schemas/resident-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import ResidentForm from "./resident-form";

interface Props {
  resident: TResident;
  isLoading?: boolean;
}

export default function EditResidentForm({ resident, isLoading }: Props) {
  const { mutateAsync, isPending } = useUpdateResident();

  const form = useForm<TResident>({
    resolver: zodResolver(FormResidentSchema),
    defaultValues: {
      blood_type: resident.blood_type,
      date_of_birth: new Date(resident.date_of_birth),
      name: resident.name,
      gender: resident.gender,
      marital_status: resident.marital_status,
      religion: resident.religion,
      education: resident.education,
      occupation: resident.occupation,
      citizenship: resident.citizenship,
      disabilities: resident.disabilities,
      national_number_id: resident.national_number_id,
      father_name: resident.father_name,
      mother_name: resident.mother_name,
      place_of_birth: resident.place_of_birth,
      region_id: resident.region_id,
      rt: resident.rt,
      rw: resident.rw,
    },
  });

  async function onSubmit(values: TResident) {
    await mutateAsync({
      id: resident.id as number,
      payload: values,
    });
  }

  return (
    <>
      <ResidentForm form={form} onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
