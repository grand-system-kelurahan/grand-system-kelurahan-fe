/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonOutlineCSS } from "@/consts/button-css";
import { TLetterApplicationWithRelation } from "@/schemas/letter-application-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterApplicationStore } from "@/stores/use-letter-application-store";
import { ColumnDef } from "@tanstack/react-table";

export const letterApplicationColumns: ColumnDef<TLetterApplicationWithRelation>[] =
  [
    {
      id: "resident_name",
      header: "Penduduk",
      cell: ({ row }) => {
        const letterApplication = row.original;
        return <p>{letterApplication.resident.name}</p>;
      },
    },
    {
      id: "letter_type",
      header: "Jenis Surat",
      cell: ({ row }) => {
        const letterApplication = row.original;
        return <p>{letterApplication.letter_type.letter_name}</p>;
      },
    },
    {
      accessorKey: "letter_number",
      header: "Nomor Surat",
      cell: ({ row }) => {
        const letterApplication = row.original;
        return <p>{letterApplication.letter_number || "-"}</p>;
      },
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const letterApplication = row.original;
        return <p>{letterApplication.status || "-"}</p>;
      },
    },
    {
      id: "Aksi",
      header: "Aksi",
      cell: ({ row }) => {
        const letterApplication = row.original;
        const { openDialog } = useIsDialogOpenStore();
        const { setSelectedData } = useLetterApplicationStore();
        const handleApprove = () => {
          openDialog("approve");
          setSelectedData(letterApplication);
        };
        return (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className={ButtonOutlineCSS}>
                <Pencil />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleApprove}>
                  Terima
                </DropdownMenuItem>
                <DropdownMenuItem>Tolak</DropdownMenuItem>
                <DropdownMenuItem>Detail</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
