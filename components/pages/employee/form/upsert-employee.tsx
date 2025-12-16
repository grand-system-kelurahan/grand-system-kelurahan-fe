"use client";

import { useMemo } from "react";

import { useEmployeeById } from "@/hooks/use-employees";
import type { TEmployeeWithRelation } from "@/schemas/employee-schema";

import ButtonBack from "@/components/atoms/button-back";
import { Description, Heading1 } from "@/components/atoms/typography";
import CodeEditorDialog from "@/components/molecules/code-editor-dialog";
import FormSkeleton from "@/components/molecules/form-skeleton";
import EmployeeUpsertForm from "@/components/organisms/employee-upsert-form";

type Props = {
  idParam: string;
};

export default function EmployeeUpsertPage({ idParam }: Props) {
  const isCreate = idParam === "new";
  const idNum = isCreate ? 0 : Number(idParam);

  const { data, isLoading } = useEmployeeById(idNum);

  const employeeData: Partial<TEmployeeWithRelation> = useMemo(() => {
    if (isCreate) return {};
    const raw = (data as any)?.data ?? data;
    return raw ?? {};
  }, [data, isCreate]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Heading1 text={isCreate ? "Tambah Data Pegawai" : "Edit Data Pegawai"} />
          <Description
            text={
              isCreate
                ? "Silahkan isi form berikut untuk menambahkan data pegawai"
                : "Silahkan isi form berikut untuk memperbarui data pegawai"
            }
          />
        </div>
        <ButtonBack />
      </div>

      <hr className="my-4" />

      {!isCreate && data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}

      {!isCreate && isLoading ? (
        <FormSkeleton columnCount={2} rowCount={6} />
      ) : (
        <EmployeeUpsertForm isCreate={isCreate} employee={employeeData} />
      )}
    </div>
  );
}
