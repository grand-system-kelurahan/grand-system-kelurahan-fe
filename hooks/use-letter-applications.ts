import { toast } from "sonner";

import { TLetterApplication } from "@/schemas/letter-application-schema";
import {
  createLetterApplication,
  deleteLetterApplication,
  getAllLetterApplications,
  updateLetterApplication,
} from "@/services/letter-application-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterApplicationStore } from "@/stores/use-letter-application-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "LetterApplication";

const toastText = "Jenis Surat ";

export function useLetterApplications() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllLetterApplications,
  });
}

export function useCreateLetterApplication() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: (payload: TLetterApplication) =>
      createLetterApplication(payload),

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

export function useUpdateLetterApplication() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useLetterApplicationStore();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: TLetterApplication;
    }) =>
      updateLetterApplication({
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

export function useDeleteLetterApplication() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useLetterApplicationStore();

  return useMutation({
    mutationFn: (id: number) => deleteLetterApplication(id),
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
