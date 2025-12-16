import { toast } from "sonner";

import { TUser } from "@/schemas/user-schema";
import { checkUserLogin } from "@/services/auth-service";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/services/user-service";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useUserStore } from "@/stores/use-user-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "users";

const toastText = "Pengguna ";

export function useUserLogin() {
  return useQuery({
    queryKey: [queryKey, "login"],
    queryFn: checkUserLogin,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: (payload: TUser) => createUser(payload),

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

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { deleteSelectedData } = useUserStore();
  const { closeDialog } = useIsDialogOpenStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TUser }) =>
      updateUser({
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

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useUserStore();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
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
