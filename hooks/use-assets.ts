import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TAsset } from "@/schemas/asset-schema";
import {
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from "@/services/asset-service";
import { useAssetStore } from "@/stores/use-asset-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "assets";

const toastText = "Aset ";

export function useAssets() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllAssets,
  });
}

export function useAssetById(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: TAsset) => createAsset(payload),

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

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useAssetStore();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TAsset }) =>
      updateAsset({
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

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useAssetStore();

  return useMutation({
    mutationFn: (id: number) => deleteAsset(id),
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
