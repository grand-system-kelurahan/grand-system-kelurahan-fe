import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TResident } from "@/schemas/resident-schema";
import { TResidentVerification } from "@/schemas/resident-verification-schema";
import {
  createResident,
  deleteResident,
  getAllResidents,
  getResidentById,
  getResidentByName,
  searchResidents,
  updateResident,
} from "@/services/resident-service";
import {
  createResidentVerification,
  getAllResidentVerifications,
  getResidentVerificationById,
} from "@/services/resident-verification-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useResidentStore } from "@/stores/use-resident-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "resident-verifications";
const toastText = "Pengajuan penduduk ";

export function useResidentVerifications() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllResidentVerifications,
  });
}

export function useResidentVerificationById(id: number) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getResidentVerificationById(id),
  });
}

export function useCreateResidentVerification() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: createResidentVerification,
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

export function useUpdateResident() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useResidentStore();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TResident }) =>
      updateResident({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey, variables.id] });
      toast.success(toastText + "berhasil diperbarui");
      closeDialog();
      router.back();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diperbarui");
      console.error("Error updating data:", error);
      closeDialog();
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useResidentStore();

  return useMutation({
    mutationFn: (id: number) => deleteResident(id),
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
