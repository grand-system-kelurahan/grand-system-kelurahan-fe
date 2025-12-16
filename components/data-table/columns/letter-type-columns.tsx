/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TLetterType } from "@/schemas/letter-type-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterTypeStore } from "@/stores/use-letter-type-store";
import { ColumnDef } from "@tanstack/react-table";

export const letterTypeColumns: ColumnDef<TLetterType>[] = [
  {
    accessorKey: "letter_code",
    header: "Kode",
  },
  {
    accessorKey: "letter_name",
    header: "Nama",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const letterType = row.original;
      const { openDialog } = useIsDialogOpenStore();
      const { setSelectedData } = useLetterTypeStore();
      const handleEdit = () => {
        openDialog("edit");
        setSelectedData(letterType);
      };
      const handleDelete = () => {
        openDialog("delete");
        setSelectedData(letterType);
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
