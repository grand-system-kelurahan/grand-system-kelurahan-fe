import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { TFamilyCard } from "@/schemas/family-card-schema";
import {
  createFamilyCard,
  deleteFamilyCard,
  getAllFamilyCards,
  getFamilyCardById,
  updateFamilyCard,
} from "@/services/family-card-service";
import { useFamilyCardStore } from "@/stores/use-family-card-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "family-cards";

const toastText = "Kartu keluarga ";

export function useFamilyCards() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllFamilyCards,
  });
}

export function useFamilyCardById(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getFamilyCardById(id),
    enabled: !!id,
  });
}

export function useCreateFamilyCard() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: TFamilyCard) => createFamilyCard(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeDialog();
      toast.success(toastText + "berhasil dibuat");
      router.back();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dibuat");
      console.error("Error creating data:", error);
      closeDialog();
    },
  });
}

export function useUpdateFamilyCard() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useFamilyCardStore();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TFamilyCard }) =>
      updateFamilyCard({
        id,
        payload,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [queryKey, variables.id],
      });
      toast.success(toastText + "berhasil diperbarui");
      closeDialog();
      router.back();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diperbarui");
      console.error("Error updating data:", error);
    },
  });
}

export function useDeleteFamilyCard() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useFamilyCardStore();

  return useMutation({
    mutationFn: (id: number) => deleteFamilyCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(toastText + "berhasil dihapus");
      closeDialog();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dihapus");
      console.error("Error deleting data:", error);
      closeDialog();
    },
  });
}
