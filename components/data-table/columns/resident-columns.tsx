/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonOutlineGreen } from "@/consts/button-css";
import { JenisPekerjaan } from "@/consts/data-definitions";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useRegions } from "@/hooks/use-regions";
import { calculateAge, formatDate } from "@/lib/utils";
import { TRegion } from "@/schemas/region-schema";
import { TResident } from "@/schemas/resident-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useResidentStore } from "@/stores/use-resident-store";
import { TSelectOption } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const pendudukColumnsAdminView: ColumnDef<TResident>[] = [
  {
    accessorKey: "name",
    header: "Nama Lengkap",
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      return <p className="uppercase">{penduduk.name}</p>;
    },
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      return <p className="uppercase">{penduduk.gender}</p>;
    },
  },
  {
    accessorKey: "date_of_birth",
    header: "Tanggal Lahir",
  },
  {
    accessorKey: "usia",
    header: "Usia",
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      const { years } = calculateAge(penduduk.date_of_birth);
      return <p>{penduduk.date_of_birth && years}</p>;
    },
  },
  {
    accessorKey: "lingkungan",
    header: ({ column }) => {
      const { data, isLoading } = useRegions();
      const regionsData: TRegion[] = data?.data?.regions || [];
      const regionOptions: TSelectOption[] = regionsData.map((banjar) => ({
        value: banjar.id as number,
        label: banjar.name,
      }));

      return (
        <div className="flex flex-col justify-start items-start gap-2 p-2">
          <span className="text-start">Banjar</span>
          <Select
            onValueChange={(value) => {
              column.setFilterValue(value === "all" ? undefined : value);
            }}>
            <SelectTrigger className="w-[120px] h-7 text-sm">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {regionOptions.map((banjar) => (
                <SelectItem key={banjar.value} value={banjar.value as string}>
                  {banjar.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      return <p className="uppercase">{penduduk.region_id ?? "Tidak ada"}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "jenisPekerjaan",
    header: ({ column }) => (
      <div className="flex flex-col justify-start items-start gap-2 p-2">
        <span className="text-start">Pekerjaan</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}>
          <SelectTrigger className="w-[120px] h-7 text-sm">
            <SelectValue placeholder="Pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {JenisPekerjaan.map((pekerjaan) => (
              <SelectItem key={pekerjaan} value={pekerjaan}>
                {pekerjaan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      return <p className="uppercase">{penduduk.occupation}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      const [date, setDate] = useState<string>("");
      return (
        <div className="flex flex-col justify-start items-start gap-2 p-2">
          <span className="text-start">Terakhir Diperbarui</span>
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              column.setFilterValue(
                e.target.value ? new Date(e.target.value) : undefined
              );
            }}
            placeholder="Pilih tanggal"
            className="w-[150px] h-7 text-sm"
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      return (
        <p className="uppercase">
          {formatDate(penduduk.updated_at?.toString())}
        </p>
      );
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const penduduk: TResident = row.original;
      const { setSelectedData } = useResidentStore();
      const { openDialog } = useIsDialogOpenStore();
      const pathSegments = usePathSegments();

      async function handleDelete() {
        setSelectedData(penduduk);
        openDialog("delete");
      }

      return (
        <div className="flex gap-2">
          <Link href={`${pathSegments.raw}/${penduduk.id}/detail`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`${pathSegments.raw}/${penduduk.id}/edit`}>
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
