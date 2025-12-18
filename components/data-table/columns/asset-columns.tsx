/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ButtonOutlineGreen } from "@/consts/button-css";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TAssetWithRelation } from "@/schemas/asset-schema";
import { useAssetStore } from "@/stores/use-asset-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { ColumnDef } from "@tanstack/react-table";

export const assetColumns: ColumnDef<TAssetWithRelation>[] = [
  {
    accessorKey: "asset_code",
    header: "Kode",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.asset_code || "-"}</p>;
    },
  },
  {
    accessorKey: "asset_name",
    header: "Nama",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.asset_name || "-"}</p>;
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.description || "-"}</p>;
    },
  },
  {
    accessorKey: "asset_type",
    header: "Jenis",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.asset_type || "-"}</p>;
    },
  },
  {
    accessorKey: "total_stock",
    header: "Total Stok",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.total_stock}</p>;
    },
  },
  {
    accessorKey: "available_stock",
    header: "Stok Tersedia",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.available_stock}</p>;
    },
  },
  {
    accessorKey: "borrowed_stock",
    header: "Stok Dipinjam",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.borrowed_stock}</p>;
    },
  },
  {
    accessorKey: "asset_status",
    header: "Status",
    cell: ({ row }) => {
      const asset = row.original;
      return <p className="uppercase">{asset.asset_status || "-"}</p>;
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const asset = row.original;
      const pathSegments = usePathSegments();
      const { openDialog } = useIsDialogOpenStore();
      const { setSelectedData } = useAssetStore();

      function handleDelete() {
        openDialog("delete");
        setSelectedData(asset);
      }

      return (
        <div className="flex gap-2">
          <Link href={`${pathSegments.fullPath}/${asset.id}/detail`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`${pathSegments.fullPath}/${asset.id}/edit`}>
            <Button
              size={"sm"}
              variant={"outline"}
              className={ButtonOutlineGreen}>
              <Pencil />
            </Button>
          </Link>
          <Button size={"sm"} variant={"destructive"} onClick={handleDelete}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
