/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Pencil, Trash } from "lucide-react";

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
import { ButtonOutlineCSS } from "@/consts/button-css";
import { formatDate, getCssColorInDoubleMode } from "@/lib/utils";
import { TLetterApplicationWithRelation } from "@/schemas/letter-application-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterApplicationStore } from "@/stores/use-letter-application-store";
import { ColumnDef } from "@tanstack/react-table";

export const letterApplicationColumns: ColumnDef<TLetterApplicationWithRelation>[] =
  [
    {
      id: "resident_name",
      accessorKey: "resident.name",
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
        return letterApplication.status == "new" ? (
          <Badge
            variant={"outline"}
            className={getCssColorInDoubleMode("yellow")}>
            Baru
          </Badge>
        ) : letterApplication.status == "on_progress" ? (
          <Badge
            variant={"outline"}
            className={getCssColorInDoubleMode("amber")}>
            Diproses
          </Badge>
        ) : letterApplication.status == "approved" ? (
          <Badge
            variant={"outline"}
            className={getCssColorInDoubleMode("green")}>
            Disetujui
          </Badge>
        ) : (
          <Badge variant={"outline"} className={getCssColorInDoubleMode("red")}>
            Ditolak
          </Badge>
        );
      },
    },
    {
      accessorKey: "submission_date",
      header: "Tanggal Pengajuan",
      cell: ({ row }) => {
        const letterApplication = row.original;
        return (
          <p>
            {formatDate(letterApplication.submission_date?.toString()) || "-"}
          </p>
        );
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
        const handleView = () => {
          openDialog("view");
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
                <DropdownMenuItem onClick={handleView}>Detail</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
