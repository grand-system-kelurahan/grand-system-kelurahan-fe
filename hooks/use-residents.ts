import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TResident } from "@/schemas/resident-schema";
import {
  createResident,
  deleteResident,
  getAllResidents,
  getResidentById,
  getResidentByName,
  searchResidents,
  updateResident,
} from "@/services/resident-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useResidentStore } from "@/stores/use-resident-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "resident";
const toastText = "Penduduk ";

export function useResidents() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllResidents,
  });
}

export function useSearchResidents(searchTerm: string) {
  return useQuery({
    queryKey: [queryKey, "search", searchTerm],
    queryFn: () => searchResidents(searchTerm),
    enabled: !!searchTerm,
  });
}

export function useResidentById(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getResidentById(id),
    enabled: !!id,
  });
}

export function useResidentByName(name: string) {
  return useQuery({
    queryKey: [queryKey, name],
    queryFn: () => getResidentByName(name),
    enabled: !!name,
  });
}

export function useCreateResident() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: TResident) => createResident(payload),
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
