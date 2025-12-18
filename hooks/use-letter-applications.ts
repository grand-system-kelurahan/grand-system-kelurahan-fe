import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { TLetterApplication } from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";
import {
  approveLetterApplication,
  createLetterApplication,
  deleteLetterApplication,
  getAllLetterApplications,
  getLetterApplicationsByUserId,
  rejectLetterApplication,
} from "@/services/letter-application-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterApplicationStore } from "@/stores/use-letter-application-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUserLogin } from "./use-users";

const queryKey = "letter-applications";

const toastText = "Jenis Surat ";

export function useLetterApplications() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllLetterApplications,
  });
}

export function useMyLetterApplications() {
  const { data, isLoading } = useUserLogin();
  const userData: TUser = useMemo(() => data, [data]);
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getLetterApplicationsByUserId(userData.id as number),
    enabled: !!data && !isLoading,
  });
}

export function useCreateLetterApplication() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: TLetterApplication) =>
      createLetterApplication(payload),

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

export function useApproveLetterApplication() {
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
      approveLetterApplication({
        id,
        payload,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [queryKey, variables.id],
      });
      toast.success(toastText + "berhasil diterima");
      closeDialog();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diterima");
      console.error("Error updating data:", error);
      closeDialog();
    },
  });
}

export function useRejectLetterApplication() {
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
      rejectLetterApplication({
        id,
        payload,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [queryKey, variables.id],
      });
      toast.success(toastText + "berhasil ditolak");
      closeDialog();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal ditolak");
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
