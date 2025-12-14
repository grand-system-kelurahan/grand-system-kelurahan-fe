import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { TFamilyMember } from "@/schemas/family-member-schema";
import {
  createFamilyMember,
  deleteFamilyMember,
  updateFamilyMember,
} from "@/services/family-member-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "family-cards";

const toastText = "Kartu keluarga ";

export function useCreateFamilyMember() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({
      familyCardId,
      payload,
    }: {
      familyCardId: number;
      payload: TFamilyMember;
    }) =>
      createFamilyMember({
        familyCardId,
        payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeDialog();
      toast.success("Penduduk berhasil ditambahkan ke kartu keluarga");
    },
    onError: (error) => {
      toast.error("Penduduk gagal ditambahkan ke kartu keluarga");
      console.error("Error creating data:", error);
      closeDialog();
    },
  });
}

export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({
      familyCardId,
      payload,
    }: {
      familyCardId: number;
      payload: TFamilyMember;
    }) =>
      updateFamilyMember({
        familyCardId,
        payload,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Anggota keluarga berhasil diperbarui");
      closeDialog();
    },
    onError: (error) => {
      toast.error("Anggota keluarga gagal diperbarui");
      console.error("Error updating data:", error);
    },
  });
}

export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({
      familyCardId,
      memberId,
    }: {
      familyCardId: number;
      memberId: number;
    }) =>
      deleteFamilyMember({
        familyCardId,
        memberId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Penduduk berhasil dihapus dari kartu keluarga");
      closeDialog();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dihapus");
      console.error("Error deleting data:", error);
      closeDialog();
    },
  });
}
