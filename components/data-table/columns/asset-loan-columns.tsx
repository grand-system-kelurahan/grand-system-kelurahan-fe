"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Calendar, Package, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useAssetLoanStore } from "@/stores/use-asset-loan-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    requested: "outline",
    borrowed: "default",
    returned: "secondary",
    rejected: "destructive",
  };

  const labels: Record<string, string> = {
    requested: "Menunggu",
    borrowed: "Dipinjam",
    returned: "Dikembalikan",
    rejected: "Ditolak",
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {labels[status] || status}
    </Badge>
  );
};

export const assetLoanColumns: ColumnDef<TAssetLoanWithRelations>[] = [
  {
    accessorKey: "asset.asset_name",
    header: "Nama Aset",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.asset?.asset_name || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "resident.name",
    header: "Peminjam",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.resident?.name || "Unknown"}</span>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-medium">{row.getValue("quantity")}</span>
      </div>
    ),
  },
  {
    accessorKey: "loan_date",
    header: "Tanggal Pinjam",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>
          {new Date(row.getValue("loan_date")).toLocaleDateString("id-ID")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "planned_return_date",
    header: "Rencana Kembali",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>
          {new Date(row.getValue("planned_return_date")).toLocaleDateString(
            "id-ID"
          )}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "loan_status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("loan_status")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const loan = row.original;
      const { setSelectedData } = useAssetLoanStore();
      const { openDialog } = useIsDialogOpenStore();

      const handleAction = (type: "approve" | "return" | "reject" | "view") => {
        setSelectedData(loan);
        openDialog(type);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAction("view")}>
              Detail
            </DropdownMenuItem>

            {loan.loan_status === "requested" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => handleAction("approve")}
                >
                  Setujui
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleAction("reject")}
                >
                  Tolak
                </DropdownMenuItem>
              </>
            )}

            {loan.loan_status === "borrowed" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-blue-600"
                  onClick={() => handleAction("return")}
                >
                  Kembalikan
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
