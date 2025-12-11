import { toast } from "sonner";

import { TRegion } from "@/schemas/region-schema";
import {
  createRegion,
  deleteRegion,
  getAllRegions,
  updateRegion,
} from "@/services/region-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useRegionStore } from "@/stores/use-region-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "region";

const toastText = "Lingkungan ";

export function useRegions() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllRegions,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: (payload: TRegion) => createRegion(payload),

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

export function useUpdateRegion() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useRegionStore();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TRegion }) =>
      updateRegion({
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

export function useDeleteRegion() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useRegionStore();

  return useMutation({
    mutationFn: (id: number) => deleteRegion(id),
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
