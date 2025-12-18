/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ExternalLink, Eye, Pencil, Trash } from "lucide-react";
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
import { calculateAge, formatDate, mapToOptions } from "@/lib/utils";
import { TRegion } from "@/schemas/region-schema";
import { TResident, TResidentWithRelation } from "@/schemas/resident-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useResidentStore } from "@/stores/use-resident-store";
import { TSelectOption } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const residentColumns: ColumnDef<TResidentWithRelation>[] = [
  {
    accessorKey: "national_number_id",
    header: "NIK",
    cell: ({ row }) => {
      const penduduk = row.original;
      return <p>{penduduk.national_number_id}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama Lengkap",
    cell: ({ row }) => {
      const penduduk = row.original;
      return <p className="uppercase">{penduduk.name}</p>;
    },
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const penduduk = row.original;
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
      const penduduk = row.original;
      const { years } = calculateAge(penduduk.date_of_birth);
      return <p>{penduduk.date_of_birth && years}</p>;
    },
  },
  {
    accessorKey: "family_member",
    header: "Terdaftar KK",
    cell: ({ row }) => {
      const penduduk = row.original;
      return penduduk.family_member == null ? (
        <Badge
          variant={"outline"}
          className="bg-red-100 dark:bg-red-800 border-none text-red-600 dark:text-red-100">
          Tidak
        </Badge>
      ) : (
        <Link
          href={`/admin/dashboard/family-cards/${penduduk.family_member?.family_card_id}/detail`}>
          <Badge
            variant={"outline"}
            className="bg-green-100 dark:bg-green-800 border-none text-green-600 dark:text-green-100">
            Ya <ExternalLink />
          </Badge>
        </Link>
      );
    },
  },
  {
    accessorKey: "lingkungan",
    header: ({ column }) => {
      const { data, isLoading } = useRegions();
      const regionsData: TRegion[] = data?.data || [];
      const regionOptions = mapToOptions(regionsData, "id", "name");

      return (
        <div className="flex flex-col justify-start items-start gap-2 p-2">
          <span className="text-start">Lingkungan</span>
          <Select
            onValueChange={(value) => {
              column.setFilterValue(value === "all" ? undefined : value);
            }}
            disabled={isLoading}>
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
      const penduduk = row.original;
      return (
        <p className="uppercase">{penduduk.region?.name ?? "Tidak ada"}</p>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const resident = row.original;
      const regionId = resident?.region_id?.toString();

      return regionId === filterValue.toString();
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
      const penduduk = row.original;
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
      const penduduk = row.original;
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
      const penduduk = row.original;
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
