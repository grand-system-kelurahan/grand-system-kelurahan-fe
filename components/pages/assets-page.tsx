"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/use-assets";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TAssetWithRelation } from "@/schemas/asset-schema";
import { useAssetStore } from "@/stores/use-asset-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { assetColumns } from "../data-table/columns/asset-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import DeleteAssetForm from "../organisms/delete-asset-form";

export default function AssetsPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useAssetStore();
  const { data, isLoading, refetch } = useAssets();

  const assetsData: TAssetWithRelation[] = useMemo(
    () => data?.data || [],
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Aset" />
          <Description text="Data aset yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
          <Button>
            <PlusCircle />
            Tambah Data Aset
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
            columns={assetColumns}
            data={assetsData}
            filteringKey="asset_name"
            refetch={refetch}
          />
        </div>
      )}
      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Aset"
          description={`Aksi ini akan menghapus data aset ${selectedData.asset_name}. Apakah anda yakin?`}>
          <DeleteAssetForm asset={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
