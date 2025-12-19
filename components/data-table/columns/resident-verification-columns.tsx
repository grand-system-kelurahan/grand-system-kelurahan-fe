/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ButtonOutlineGreen } from "@/consts/button-css";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TAssetWithRelation } from "@/schemas/asset-schema";
import { TResidentVerificationWithRelation } from "@/schemas/resident-verification-schema";
import { useAssetStore } from "@/stores/use-asset-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { ColumnDef } from "@tanstack/react-table";

export const residentVerificationColumns: ColumnDef<TResidentVerificationWithRelation>[] =
  [
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "resident_name",
      accessorKey: "resident.name",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Nama Penduduk</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <p className="font-medium">{data.resident?.name || "-"}</p>;
      },
      filterFn: (row, id, value) => {
        // Custom filter untuk nested property
        const residentName = row.original.resident?.name?.toLowerCase() || "";
        return residentName.includes(value.toLowerCase());
      },
      sortingFn: (rowA, rowB, columnId) => {
        // Custom sorting untuk nested property
        const nameA = rowA.original.resident?.name?.toLowerCase() || "";
        const nameB = rowB.original.resident?.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      },
      enableSorting: true,
      enableColumnFilter: true,
    },

    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const asset = row.original;
        const pathSegments = usePathSegments();
        const { openDialog } = useIsDialogOpenStore();
        const { setSelectedData } = useAssetStore();

        // function handleDelete() {
        //   openDialog("delete");
        //   setSelectedData(asset);
        // }

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
            {/* <Button size={"sm"} variant={"destructive"} onClick={handleDelete}>
            <Trash />
          </Button> */}
          </div>
        );
      },
    },
  ];
