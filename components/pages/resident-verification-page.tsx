"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/use-assets";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useResidentVerifications } from "@/hooks/use-resident-verifications";
import { TAssetWithRelation } from "@/schemas/asset-schema";
import {
  TResidentVerification,
  TResidentVerificationWithRelation,
} from "@/schemas/resident-verification-schema";
import { useAssetStore } from "@/stores/use-asset-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { residentVerificationColumns } from "../data-table/columns/resident-verification-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import DeleteAssetForm from "../organisms/delete-asset-form";

export default function ResidentVerificationPage() {
  const pathSegments = usePathSegments();
  const { data, isLoading, refetch } = useResidentVerifications();

  const assetsData: TResidentVerificationWithRelation[] = useMemo(
    () => data?.data || [],
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Pengajuan Penduduk" />
          <Description text="Data pengajuan penduduk yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
          <Button>
            <PlusCircle />
            Tambah Data Pengajuan Penduduk
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
            title="Total Aset"
            value={assetsData.length || 0}
            description="Total Aset di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={residentVerificationColumns}
            data={assetsData}
            filteringKey="resident_name"
            refetch={refetch}
          />
        </div>
      )}
      {/* {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Aset"
          description={`Aksi ini akan menghapus data aset ${selectedData.asset_name}. Apakah anda yakin?`}>
          <DeleteAssetForm asset={selectedData} />
        </DialogTemplate>
      )} */}
    </div>
  );
}
