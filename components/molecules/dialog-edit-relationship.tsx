"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  resident: TResident;
  relationship: TRelationship;
  familyMember: TFamilyMember;
}

export default function DialogEditRelationship({
  resident,
  relationship,
  familyMember,
}: Props) {
  const [statusHubungan, setRelationship] =
    useState<TRelationship>(relationship);

  const { mutate, isPending } = useUpdateFamilyMember();

  async function onSubmit() {
    const dataSubmit: TFamilyMember = {
      id: familyMember.id,
      relationship: statusHubungan,
      resident_id: resident.id,
      family_card_id: familyMember.family_card_id,
    };

    mutate({
      familyCardId: familyMember.family_card_id as number,
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
              Silahkan pilih status hubungan yang sesuai untuk anggota bernama{" "}
              <span className="font-bold">{resident.name}</span>
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
