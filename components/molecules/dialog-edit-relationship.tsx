"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonOutlineCSS } from "@/consts/button-css";
import { StatusHubunganDalamKeluarga } from "@/consts/data-definitions";
import { useUpdateFamilyMember } from "@/hooks/use-family-members";
import { TFamilyMember } from "@/schemas/family-member-schema";
import { TResident } from "@/schemas/resident-schema";
import { TRelationship } from "@/types/types";

interface Props {
  relationship: TRelationship;
  familyCardId: number;
  familyMember: TFamilyMember;
}

export default function DialogEditRelationship({
  relationship,
  familyCardId,
  familyMember,
}: Props) {
  const [statusHubungan, setRelationship] =
    useState<TRelationship>(relationship);

  const { mutate, isPending } = useUpdateFamilyMember();

  async function onSubmit() {
    const dataSubmit: TFamilyMember = {
      ...familyMember,
      relationship: statusHubungan,
    };

    mutate({
      familyCardId: familyCardId,
      payload: dataSubmit,
    });
  }

  return (
    <div className="">
      <AlertDialog>
        <AlertDialogTrigger className={ButtonOutlineCSS}>
          <Pencil className="w-4 h-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edit Status Hubungan dalam Keluarga
            </AlertDialogTitle>
            <AlertDialogDescription>
              Silahkan pilih status hubungan yang sesuai untuk anggota bernama
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            value={statusHubungan}
            onValueChange={(e) => setRelationship(e as TRelationship)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status Hubungan dalam Keluarga" />
            </SelectTrigger>
            <SelectContent>
              {StatusHubunganDalamKeluarga.map((status) => (
                <SelectItem value={status} key={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit} className="text-white">
              {isPending ? "Proses..." : "Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
