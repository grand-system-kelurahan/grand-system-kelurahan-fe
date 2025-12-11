/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TRegion } from "@/schemas/region-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useRegionStore } from "@/stores/use-region-store";
import { ColumnDef } from "@tanstack/react-table";

export const regionColumns: ColumnDef<TRegion>[] = [
  {
    accessorKey: "name",
    header: "Nama Lingkungan",
    cell: ({ row }) => {
      const lingkungan: TRegion = row.original;
      return <p className="uppercase">{lingkungan.name}</p>;
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const lingkungan: TRegion = row.original;
      const { openDialog } = useIsDialogOpenStore();
      const { setSelectedData } = useRegionStore();
      const handleEdit = () => {
        openDialog("edit");
        setSelectedData(lingkungan);
      };
      const handleDelete = () => {
        openDialog("delete");
        setSelectedData(lingkungan);
      };
      return (
        <div className="flex gap-2">
          <Button size={"sm"} variant={"outline"} onClick={handleEdit}>
            <Pencil />
          </Button>
          <Button size={"sm"} variant={"destructive"} onClick={handleDelete}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
