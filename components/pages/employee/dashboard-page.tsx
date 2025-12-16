"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useResidents } from "@/hooks/use-residents";
import { TResidentWithRelation } from "@/schemas/resident-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useResidentStore } from "@/stores/use-resident-store";

import { residentColumns } from "@/components/data-table/columns/resident-columns";
import { DataTable } from "@/components/data-table/data-table";
import CodeEditorDialog from "@/components/molecules/code-editor-dialog";
import DialogTemplate from "@/components/molecules/dialog-template";
import { StatCard } from "@/components/molecules/stat-card";
import TableSkeleton from "@/components/molecules/table-skeleton";
import DeleteResidentForm from "@/components/organisms/delete-resident-form";

export default function EmployeeDashboardPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useResidentStore();
  const { data, isLoading, refetch } = useResidents();

  const residentsData: TResidentWithRelation[] = useMemo(
    () => data?.data?.residents || [],
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Pegawai" />
          <Description text="Data Pegawai yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
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
            title="Total Penduduk"
            value={residentsData.length || 0}
            description="Total penduduk di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={residentColumns}
            data={residentsData}
            filteringKey="name"
            refetch={refetch}
          />
        </div>
      )}

      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Penduduk"
          description={`Aksi ini akan menghapus data penduduk ${selectedData.name}. Apakah anda yakin?`}>
          <DeleteResidentForm resident={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
