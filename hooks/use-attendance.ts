import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TAttendanceForm } from "@/schemas/attendance-schema";
import {
  clockInAttendance,
  clockOutAttendance,
  createAttendance,
  deleteAttendance,
  getAllAttendances,
  getAttendanceById,
  getAttendancesByEmployee,
  updateAttendance,
} from "@/services/attendance";

import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useAttendanceStore } from "@/stores/use-attendance-store";

const queryKey = "attendances";
const toastText = "Absensi ";

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  const list = json?.data?.attendances ?? json?.attendances ?? json?.data ?? [];
  return Array.isArray(list) ? list : [];
}

function normalizeOne(json: any) {
  return json?.data?.attendance ?? json?.attendance ?? json?.data ?? json;
}

export function useAttendances() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => normalizeList(await getAllAttendances()),
  });
}

export function useAttendanceById(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: async () => normalizeOne(await getAttendanceById(id)),
    enabled: !!id,
  });
}

export function useAttendancesByEmployee(employeeId: number) {
  return useQuery({
    queryKey: [queryKey, "employee", employeeId],
    queryFn: async () => normalizeList(await getAttendancesByEmployee(employeeId)),
    enabled: !!employeeId,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: TAttendanceForm) => createAttendance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeDialog();
      toast.success(toastText + "berhasil dibuat");
      router.back();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dibuat");
      console.error(error);
      closeDialog();
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useAttendanceStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (vars: { id: number; payload: Partial<TAttendanceForm> }) => updateAttendance(vars),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey, vars.id] });
      toast.success(toastText + "berhasil diperbarui");
      closeDialog();
      router.back();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diperbarui");
      console.error(error);
      closeDialog();
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useAttendanceStore();

  return useMutation({
    mutationFn: (id: number) => deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(toastText + "berhasil dihapus");
      closeDialog();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dihapus");
      console.error(error);
      closeDialog();
    },
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { employee_id: number; time: string }) => clockInAttendance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Clock-in berhasil");
    },
    onError: (error) => {
      toast.error("Clock-in gagal");
      console.error(error);
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { employee_id: number; time: string }) => clockOutAttendance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Clock-out berhasil");
    },
    onError: (error) => {
      toast.error("Clock-out gagal");
      console.error(error);
    },
  });
}
