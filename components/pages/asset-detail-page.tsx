"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { useAssetById } from "@/hooks/use-assets";
import { TAssetWithRelation } from "@/schemas/asset-schema";
import { DataTable } from "../data-table/data-table";

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
import { assetLoanColumns } from "../data-table/columns/asset-loan-columns";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useAssetLoanStore } from "@/stores/use-asset-loan-store";
import { useAssetLoans } from "@/hooks/use-asset-loans";

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

      {/* LIST PEMINJAMAN */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Riwayat Peminjaman Aset</h2>

        {assetsData?.id && <AssetLoanTable assetId={assetsData.id} />}
      </div>
    </div>
  );
}

function AssetLoanTable({ assetId }: { assetId: number }) {
  const { selectedData, filters, setFilters } = useAssetLoanStore();

  const { data, isLoading, refetch } = useAssetLoans({
    loan_status: filters.status,
    from_date: filters.fromDate,
    to_date: filters.toDate,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
    keyword: filters.keyword,
    asset_id: assetId,
  });

  const assetLoansData: TAssetLoanWithRelations[] = useMemo(
    () => data?.data?.asset_loans || [],
    [data]
  );

  const meta = data?.meta || {
    current_page: 1,
    total: 0,
    per_page: 10,
  };

  if (isLoading) {
    return <TableSkeleton columnCount={5} rowCount={5} />;
  }

  return (
    <>
      {isLoading ? (
        <TableSkeleton rowCount={10} columnCount={6} />
      ) : (
        <div className="border rounded-lg">
          <DataTable
            columns={assetLoanColumns}
            data={assetLoansData}
            filteringKey="asset.asset_name"
            refetch={refetch}
            pagination={{
              currentPage: meta.current_page,
              totalItems: meta.total,
              perPage: meta.per_page,
              onPageChange: (page) => {
                // Handle pagination if needed
              },
            }}
          />
        </div>
      )}
    </>
  );
}
