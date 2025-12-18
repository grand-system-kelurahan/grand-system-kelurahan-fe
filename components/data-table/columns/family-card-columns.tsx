/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
import { usePathSegments } from "@/hooks/use-path-segment";
import { useRegions } from "@/hooks/use-regions";
import { formatDate, mapToOptions } from "@/lib/utils";
import {
  TFamilyCard,
  TFamilyCardWithRelation,
} from "@/schemas/family-card-schema";
import { TRegion } from "@/schemas/region-schema";
import { useFamilyCardStore } from "@/stores/use-family-card-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { TSelectOption } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const familyCardColumns: ColumnDef<TFamilyCardWithRelation>[] = [
  {
    accessorKey: "family_card_number",
    header: "Nomor Kartu Keluarga",
  },
  {
    accessorKey: "head_of_family_name",
    header: "Nama Kepala Keluarga",
    cell: ({ row }) => {
      const familyCard: TFamilyCard = row.original;
      return (
        <p className="uppercase">{familyCard.head_of_family_name || "-"}</p>
      );
    },
  },
  {
    accessorKey: "lingkungan",
    header: ({ column }) => {
      const { data, isLoading } = useRegions();
      const regionsData: TRegion[] = useMemo(() => data?.data || [], [data]);
      const regionOptions: TSelectOption[] = mapToOptions(
        regionsData || [],
        "id",
        "name"
      );
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
              {regionOptions.map((region) => (
                <SelectItem key={region.value} value={region.value.toString()}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
    cell: ({ row }) => {
      const familyCard = row.original;
      return <p className="uppercase">{familyCard?.region?.name || "-"}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const familyCard = row.original;
      const regionId = familyCard?.region_id?.toString();

      return regionId === filterValue.toString();
    },
  },
  {
    accessorKey: "total_members",
    header: "Total Anggota Keluarga",
  },
  {
    accessorKey: "updated_at",
    header: "Terakhir Diperbarui",

    cell: ({ row }) => {
      const familyCard: TFamilyCard = row.original;
      return (
        <p className="uppercase">
          {formatDate(familyCard.updated_at?.toString())}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const familyCard = row.original;
      const pathSegments = usePathSegments();
      const { openDialog } = useIsDialogOpenStore();
      const { setSelectedData } = useFamilyCardStore();

      function handleDelete() {
        openDialog("delete");
        setSelectedData(familyCard);
      }

      return (
        <div className="flex gap-2">
          <Link href={`${pathSegments.fullPath}/${familyCard.id}/detail`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`${pathSegments.fullPath}/${familyCard.id}/edit`}>
            <Button
              size={"sm"}
              variant={"outline"}
              className={ButtonOutlineGreen}>
              <Pencil />
            </Button>
          </Link>
          {familyCard.total_members == 0 && (
            <Button size={"sm"} variant={"destructive"} onClick={handleDelete}>
              <Trash />
            </Button>
          )}
        </div>
      );
    },
  },
];
