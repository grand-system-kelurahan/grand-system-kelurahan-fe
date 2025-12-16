"use client";

import { Calendar, Package, RefreshCw, UserCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssetLoans } from "@/hooks/use-asset-loans";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useAssetLoanStore } from "@/stores/use-asset-loan-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { assetLoanColumns } from "../data-table/columns/asset-loan-columns";
import { DataTable } from "../data-table/data-table";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import ApproveLoanForm from "../organisms/approve-loan-form";
import ReturnLoanForm from "../organisms/return-loan-form";
import RejectLoanForm from "../organisms/reject-loan-form";

const LOAN_STATUS_OPTIONS = [
  { value: "requested", label: "Requested" },
  { value: "borrowed", label: "Borrowed" },
  { value: "returned", label: "Returned" },
  { value: "rejected", label: "Rejected" },
];

export default function AssetLoansPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData, filters, setFilters } = useAssetLoanStore();

  const { data, isLoading, refetch } = useAssetLoans({
    loan_status: filters.status,
    from_date: filters.fromDate,
    to_date: filters.toDate,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
    keyword: filters.keyword,
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

  const summary = useMemo(() => {
    const loans = assetLoansData;
    return {
      total: loans.length,
      requested: loans.filter((l) => l.loan_status === "requested").length,
      borrowed: loans.filter((l) => l.loan_status === "borrowed").length,
      returned: loans.filter((l) => l.loan_status === "returned").length,
      rejected: loans.filter((l) => l.loan_status === "rejected").length,
    };
  }, [assetLoansData]);

  const handleStatusChange = (value: string) => {
    setFilters({ status: value });
  };

  const handleDateChange = (type: "fromDate" | "toDate", value: string) => {
    setFilters({ [type]: value || undefined });
  };

  const handleResetFilters = () => {
    setFilters({
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
      keyword: "",
    });
  };

  return (
    <div className="space-y-6">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Peminjaman Aset" />
          <Description text="Kelola pengajuan dan peminjaman aset" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Ajukan Peminjaman
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Status Peminjaman
            </label>
            <Select
              value={filters.status || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>{" "}
                {/* GUNAKAN STRING KOSONG */}
                {LOAN_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(e) => handleDateChange("fromDate", e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(e) => handleDateChange("toDate", e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Peminjaman"
          value={summary.total}
          description="Semua pengajuan"
          icon={Package}
          className="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Menunggu"
          value={summary.requested}
          description="Menunggu persetujuan"
          icon={Calendar}
          className="bg-yellow-50 border-yellow-200"
        />
        <StatCard
          title="Dipinjam"
          value={summary.borrowed}
          description="Sedang dipinjam"
          icon={UserCheck}
          className="bg-green-50 border-green-200"
        />
        <StatCard
          title="Ditolak"
          value={summary.rejected}
          description="Pengajuan ditolak"
          icon={XCircle}
          className="bg-red-50 border-red-200"
        />
      </div>

      {/* Data Table */}
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

      {/* Dialogs */}
      {dialogType === "approve" && selectedData && (
        <DialogTemplate
          title="Setujui Peminjaman"
          description={`Anda akan menyetujui peminjaman ${selectedData.asset?.asset_name} oleh ${selectedData.resident?.name}. Lanjutkan?`}
        >
          <ApproveLoanForm loan={selectedData} />
        </DialogTemplate>
      )}

      {dialogType === "return" && selectedData && (
        <DialogTemplate
          title="Konfirmasi Pengembalian"
          description={`Konfirmasi pengembalian ${selectedData.asset?.asset_name} oleh ${selectedData.resident?.name}.`}
        >
          <ReturnLoanForm loan={selectedData} />
        </DialogTemplate>
      )}

      {dialogType === "reject" && selectedData && (
        <DialogTemplate
          title="Tolak Pengajuan"
          description={`Tolak pengajuan peminjaman ${selectedData.asset?.asset_name} oleh ${selectedData.resident?.name}.`}
        >
          <RejectLoanForm loan={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
