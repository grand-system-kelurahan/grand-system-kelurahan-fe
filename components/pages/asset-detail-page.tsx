"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { useAssetById } from "@/hooks/use-assets";
import { TAssetWithRelation } from "@/schemas/asset-schema";

import ButtonBack from "../atoms/button-back";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import { EmptyOutline } from "../molecules/empty-outline";
import AssetTable from "../molecules/family-card-table";
import TableSkeleton from "../molecules/table-skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  id: number;
}

export default function AssetDetailPage({ id }: Props) {
  const { data, isLoading } = useAssetById(id);
  const assetsData: TAssetWithRelation = useMemo(() => data?.data, [data]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Detail Data Aset" />
          <Description text="Detail informasi aset yang tersedia" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columnCount={3} rowCount={6} />
      ) : assetsData ? (
        // <AssetTable AssetData={assetsData} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atribut</TableHead>
              <TableHead>Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Kode</TableCell>
              <TableCell className="uppercase">
                {assetsData?.asset_code || "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nama</TableCell>
              <TableCell className="uppercase">
                {assetsData?.asset_name || "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Deskripsi</TableCell>
              <TableCell className="uppercase">
                {assetsData?.description}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tipe</TableCell>
              <TableCell>{assetsData.asset_type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Lokasi</TableCell>
              <TableCell>{assetsData.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Stok</TableCell>
              <TableCell>{assetsData.total_stock}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Stok Tersedia</TableCell>
              <TableCell>{assetsData.available_stock}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Stok Dipinjam</TableCell>
              <TableCell>{assetsData.borrowed_stock}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>{assetsData.asset_status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <EmptyOutline
          title="Data Tidak Ditemukan"
          description="Data kartu keluarga yang Anda cari tidak ditemukan."
          icon={Users}
        />
      )}
    </div>
  );
}
