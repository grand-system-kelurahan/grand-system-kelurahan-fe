"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useEmployees } from "@/hooks/use-employees";
import { TEmployeeWithRelation } from "@/schemas/employee-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useEmployeeStore } from "@/stores/use-employee-store";

import { employeeColumns } from "@/components/data-table/columns/employee-columns";
import { DataTable } from "@/components/data-table/data-table";
import CodeEditorDialog from "@/components/molecules/code-editor-dialog";
import DialogTemplate from "@/components/molecules/dialog-template";
import { StatCard } from "@/components/molecules/stat-card";
import TableSkeleton from "@/components/molecules/table-skeleton";
import DeleteEmployeeForm from "@/components/organisms/delete-employee-form";

export default function EmployeeDashboardPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useEmployeeStore();
  const { data, isLoading, refetch } = useEmployees();

  const employeesData: TEmployeeWithRelation[] = useMemo(() => {
    if (Array.isArray(data)) return data as TEmployeeWithRelation[];
    const list = (data as any)?.data?.employees ?? (data as any)?.employees ?? (data as any)?.data ?? [];
    return Array.isArray(list) ? (list as TEmployeeWithRelation[]) : [];
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Heading1 text="Data Pegawai" />
          <Description text="Data Pegawai yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/new`}>
          <Button>
            <PlusCircle />
            Tambah Data Pegawai
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
        <TableSkeleton rowCount={10} columnCount={3} />
      ) : (
        <div className="space-y-4">
          <StatCard
            title="Total Pegawai"
            value={employeesData.length || 0}
            description="Total pegawai di Kelurahan"
            icon={Users}
          />
          <DataTable columns={employeeColumns} data={employeesData} filteringKey="name" refetch={refetch} />
        </div>
      )}

      {dialogType === "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Pegawai"
          description={`Aksi ini akan menghapus data pegawai ${selectedData.name}. Apakah anda yakin?`}
        >
          <DeleteEmployeeForm employee={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
