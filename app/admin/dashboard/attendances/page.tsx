"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PlusCircle, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading1, Description } from "@/components/atoms/typography";
import TableSkeleton from "@/components/molecules/table-skeleton";
import CodeEditorDialog from "@/components/molecules/code-editor-dialog";
import DialogTemplate from "@/components/molecules/dialog-template";
import { StatCard } from "@/components/molecules/stat-card";
import { DataTable } from "@/components/data-table/data-table";

import { useAttendances } from "@/hooks/use-attendance";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useAttendanceStore } from "@/stores/use-attendance-store";
import type { TAttendance } from "@/schemas/attendance-schema";

import { attendanceColumns } from "@/components/data-table/columns/attendance-column";
import DeleteAttendanceForm from "@/components/organisms/delete-attendance-form";

export default function AttendancesPage() {
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useAttendanceStore();
  const { data, isLoading, refetch } = useAttendances();

  const attendancesData: TAttendance[] = useMemo(() => {
    return Array.isArray(data) ? (data as TAttendance[]) : [];
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Heading1 text="Data Absensi" />
          <Description text="Data absensi yang tersedia" />
        </div>
        <Link href={`attendances/new`}>
          <Button>
            <PlusCircle />
            Tambah Absensi
          </Button>
        </Link>
      </div>

      <hr className="my-4" />

      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}

      {isLoading ? (
        <TableSkeleton rowCount={10} columnCount={5} />
      ) : (
        <div className="space-y-4">
          <StatCard
            title="Total Absensi"
            value={attendancesData.length || 0}
            description="Total data absensi"
            icon={ClipboardList}
          />
          <DataTable columns={attendanceColumns} data={attendancesData} filteringKey="date" refetch={refetch} />
        </div>
      )}

      {dialogType === "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Absensi"
          description={`Aksi ini akan menghapus data absensi ID ${selectedData.id}. Apakah anda yakin?`}
        >
          <DeleteAttendanceForm attendance={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
