"use client";

import { useMemo } from "react";

import { useResidentById } from "@/hooks/use-residents";
import { TResident } from "@/schemas/resident-schema";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import FormSkeleton from "../molecules/form-skeleton";
import TableSkeleton from "../molecules/table-skeleton";
import EditResidentForm from "../organisms/edit-resident-form";

interface Props {
  id: number;
}

export default function EditResidentPage({ id }: Props) {
  const { data, isLoading } = useResidentById(id);
  const residentData: TResident = useMemo(() => data?.data?.resident, [data]);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Edit Data Penduduk" />
          <Description text="Silahkan isi form berikut untuk memperbarui data penduduk" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      {isLoading ? (
        <FormSkeleton columnCount={2} rowCount={8} />
      ) : (
        <EditResidentForm resident={residentData} />
      )}
    </div>
  );
}
