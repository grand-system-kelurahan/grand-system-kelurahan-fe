/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-employee.ts
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TEmployeeWithRelation } from "@/schemas/employee-schema";
import { useEmployeeStore } from "@/stores/use-employee-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = "employees";
const toastText = "Pegawai ";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL_ATTENDANCE || "http://localhost:8002";

/** Helpers */
async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizeEmployeesResponse(json: any): TEmployeeWithRelation[] {
  // Your GET /employees returns an array directly
  if (Array.isArray(json)) return json;

  // Fallback if backend wraps it
  const maybe =
    json?.data?.employees ??
    json?.data ??
    json?.employees ??
    json?.result ??
    [];
  return Array.isArray(maybe) ? maybe : [];
}

/** API */
async function getAllEmployees(): Promise<TEmployeeWithRelation[]> {
  const res = await fetch(`${baseUrl}/employees`, {
    method: "GET",
    // credentials: "include", // enable if your API uses cookies/session
  });

  if (!res.ok) {
    const errBody = await parseJsonSafe(res);
    throw new Error(
      (errBody && (errBody.message || errBody.error)) ||
        "Failed to fetch employees"
    );
  }

  const json = await parseJsonSafe(res);
  return normalizeEmployeesResponse(json);
}

async function getEmployeeById(id: number): Promise<TEmployeeWithRelation> {
  const res = await fetch(`${baseUrl}/employees/${id}`, {
    method: "GET",
    // credentials: "include",
  });

  if (!res.ok) {
    const errBody = await parseJsonSafe(res);
    throw new Error(
      (errBody && (errBody.message || errBody.error)) ||
        "Failed to fetch employee"
    );
  }

  const json = await parseJsonSafe(res);

  // Most APIs return object directly for GET /employees/{id}
  const data = json?.data ?? json;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid employee response");
  }
  return data as TEmployeeWithRelation;
}

async function createEmployee(payload: Partial<TEmployeeWithRelation>) {
  const res = await fetch(`${baseUrl}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await parseJsonSafe(res);
    throw new Error(
      (errBody && (errBody.message || errBody.error)) || "Create failed"
    );
  }

  return parseJsonSafe(res);
}

async function updateEmployee(params: {
  id: number;
  payload: Partial<TEmployeeWithRelation>;
}) {
  const res = await fetch(`${baseUrl}/employees/${params.id}`, {
    // your docs show PUT, so use PUT
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // credentials: "include",
    body: JSON.stringify(params.payload),
  });

  if (!res.ok) {
    const errBody = await parseJsonSafe(res);
    throw new Error(
      (errBody && (errBody.message || errBody.error)) || "Update failed"
    );
  }

  return parseJsonSafe(res);
}

async function deleteEmployee(id: number) {
  const res = await fetch(`${baseUrl}/employees/${id}`, {
    method: "DELETE",
    // credentials: "include",
  });

  if (!res.ok) {
    const errBody = await parseJsonSafe(res);
    throw new Error(
      (errBody && (errBody.message || errBody.error)) || "Delete failed"
    );
  }

  return parseJsonSafe(res);
}

/** Hooks */
export function useEmployees() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getAllEmployees,
  });
}

export function useEmployeeById(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: Partial<TEmployeeWithRelation>) =>
      createEmployee(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeDialog();
      toast.success(toastText + "berhasil dibuat");
      router.back();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dibuat");
      console.error("Error creating employee:", error);
      closeDialog();
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();
  const router = useRouter();

  // OPTIONAL: if you have store like resident
  const { deleteSelectedData } = useEmployeeStore();

  return useMutation({
    mutationFn: (vars: {
      id: number;
      payload: Partial<TEmployeeWithRelation>;
    }) => updateEmployee(vars),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey, variables.id] });

      toast.success(toastText + "berhasil diperbarui");
      closeDialog();
      router.back();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal diperbarui");
      console.error("Error updating employee:", error);
      closeDialog();
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { closeDialog } = useIsDialogOpenStore();

  // OPTIONAL: if you have store like resident
  const { deleteSelectedData } = useEmployeeStore();

  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(toastText + "berhasil dihapus");
      closeDialog();
      deleteSelectedData();
    },
    onError: (error) => {
      toast.error(toastText + "gagal dihapus");
      console.error("Error deleting employee:", error);
      closeDialog();
    },
  });
}
