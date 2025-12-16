"use client";

import { useMemo } from "react";
import ButtonBack from "@/components/atoms/button-back";
import { Description, Heading1 } from "@/components/atoms/typography";
import CodeEditorDialog from "@/components/molecules/code-editor-dialog";
import FormSkeleton from "@/components/molecules/form-skeleton";
import AttendanceUpsertForm from "@/components/organisms/attendance-upsert-form";
import { useAttendanceById } from "@/hooks/use-attendance";
import type { TAttendance } from "@/schemas/attendance-schema";

type Props = {
  idParam: string;
};

export default function AttendanceUpsertPage({ idParam }: Props) {
  const isCreate = idParam === "new";
  const idNum = isCreate ? 0 : Number(idParam);

  const { data, isLoading } = useAttendanceById(idNum);

  const attendanceData: Partial<TAttendance> = useMemo(() => {
    if (isCreate) return {};
    return (data as any) ?? {};
  }, [data, isCreate]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Heading1 text={isCreate ? "Tambah Absensi" : "Edit Absensi"} />
          <Description text={isCreate ? "Silahkan isi form untuk menambahkan absensi" : "Silahkan isi form untuk memperbarui absensi"} />
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
        <AttendanceUpsertForm isCreate={isCreate} attendance={attendanceData} />
      )}
    </div>
  );
}
