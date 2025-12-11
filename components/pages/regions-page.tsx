"use client";

import { Map, PlusCircle } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useRegions } from "@/hooks/use-regions";
import { TRegion } from "@/schemas/region-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useRegionStore } from "@/stores/use-region-store";

import { Description, Heading1 } from "../atoms/typography";
import { regionColumns } from "../data-table/columns/region-columns";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import AddRegionForm from "../organisms/add-region-form";
import DeleteRegionRorm from "../organisms/delete-region-form";
import EditRegionForm from "../organisms/edit-region-form";

export default function RegionsPage() {
  const { dialogType, openDialog } = useIsDialogOpenStore();
  const { data, isLoading, refetch } = useRegions();
  const { selectedData } = useRegionStore();

  const regionsData: TRegion[] = useMemo(
    () => data?.data?.regions || [],
    [data?.data]
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Lingkungan" />
          <Description text="Data lingkungan yang tersedia" />
        </div>
        <Button
          className="flex justify-between items-center gap-2"
          onClick={() => openDialog("add")}>
          <PlusCircle />
          Tambah Data Lingkungan
        </Button>
      </div>
      <hr className="my-4" />
      {isLoading ? (
        <TableSkeleton rowCount={10} columnCount={3} />
      ) : (
        <div className="space-y-4">
          <StatCard
            title="Total Lingkungan"
            value={regionsData.length || 0}
            description="Total lingkungan di Kelurahan"
            icon={Map}
          />
          <DataTable
            columns={regionColumns}
            data={regionsData}
            filteringKey="name"
            refetch={refetch}
          />
        </div>
      )}

      {dialogType == "add" && (
        <DialogTemplate
          title="Tambah Data Lingkungan"
          description={`Tambahkan master data lingkungan.`}>
          <AddRegionForm />
        </DialogTemplate>
      )}

      {dialogType == "edit" && selectedData && (
        <DialogTemplate
          title="Perbarui Data Lingkungan"
          description={`Perbarui master data lingkungan.`}>
          <EditRegionForm region={selectedData} />
        </DialogTemplate>
      )}

      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Lingkungan"
          description={`Aksi ini akan menghapus data lingkungan ${selectedData.name} secara permanen. Apakah Anda yakin?`}>
          <DeleteRegionRorm region={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
