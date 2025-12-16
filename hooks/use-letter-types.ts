import { toast } from "sonner";

import { TLetterType } from "@/schemas/letter-type-schema";
import {
  createLetterType,
  deleteLetterType,
  getAllLetterTypes,
  updateLetterType,
} from "@/services/letter-type-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterTypeStore } from "@/stores/use-letter-type-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "LetterType";

const toastText = "Jenis Surat ";

export function useLetterTypes() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllLetterTypes,
  });
}

export function useCreateLetterType() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: (payload: TLetterType) => createLetterType(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeDialog();
      toast.success(toastText + "berhasil dibuat");
    },
    onError: (error) => {
      toast.error(toastText + "gagal dibuat");
      console.error("Error creating data:", error);
      closeDialog();
    },
  });
}

export function useUpdateLetterType() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useLetterTypeStore();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TLetterType }) =>
      updateLetterType({
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
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diperbarui");
      console.error("Error updating data:", error);
      closeDialog();
    },
  });
}

export function useDeleteLetterType() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useLetterTypeStore();

  return useMutation({
    mutationFn: (id: number) => deleteLetterType(id),
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
