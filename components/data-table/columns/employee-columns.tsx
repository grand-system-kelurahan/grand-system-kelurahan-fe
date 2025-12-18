import Link from "next/link";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteEmployee, useUpdateEmployee } from "@/hooks/use-employees";
import { useUsers } from "@/hooks/use-users";
import { useEmployeeStore } from "@/stores/use-employee-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import type { ColumnDef } from "@tanstack/react-table";
import type { TEmployeeWithRelation } from "@/schemas/employee-schema";
type CellProps = { row: { original: TEmployeeWithRelation } };

export function EmployeeActionsCell({ row }: CellProps) {
  const emp = row.original;

  const { data: usersResp, isLoading: usersLoading } = useUsers();
  const users = useMemo(() => {
    const list =
      (usersResp as any)?.data?.users ??
      (usersResp as any)?.users ??
      usersResp ??
      [];
    return Array.isArray(list) ? list : [];
  }, [usersResp]);

  const deleteMutation = useDeleteEmployee();
  const updateMutation = useUpdateEmployee();

  const { setSelectedData } = useEmployeeStore();
  const dialogStore = useIsDialogOpenStore() as any;

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | "">(
    (emp.user_id as any) ?? ""
  );

  const deleting =
    (deleteMutation as any).isPending ??
    (deleteMutation as any).isLoading ??
    false;

  const assigning =
    (updateMutation as any).isPending ??
    (updateMutation as any).isLoading ??
    false;

  const openDeleteDialog = () => {
    setSelectedData(emp);
    if (typeof dialogStore.openDialog === "function") {
      dialogStore.openDialog("delete");
      return true;
    }
    if (typeof dialogStore.setDialogType === "function") {
      dialogStore.setDialogType("delete");
      return true;
    }
    return false;
  };

  const handleDelete = () => {
    const opened = openDeleteDialog();
    if (opened) return;
    if (!confirm(`Hapus pegawai ${emp.name}?`)) return;
    deleteMutation.mutate(emp.id);
  };

  const handleOpenAssign = () => {
    setSelectedUserId((emp.user_id as any) ?? "");
    setAssignDialogOpen(true);
  };

  const handleSaveAssign = () => {
    if (!selectedUserId) return;
    updateMutation.mutate(
      { id: emp.id, payload: { user_id: Number(selectedUserId) } },
      { onSuccess: () => setAssignDialogOpen(false) } as any
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`employees/${emp.id}`}>
        <Button>Detail</Button>
      </Link>

      <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
        {deleting ? "Menghapus..." : "Hapus"}
      </Button>

      <Button onClick={handleOpenAssign} disabled={assigning}>
        Assign User
      </Button>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign User ke Pegawai</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-sm">
              Pegawai: <span className="font-medium">{emp.name}</span>
            </div>

            <select
              className="px-3 py-2 border rounded w-full"
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(e.target.value ? Number(e.target.value) : "")
              }
              disabled={usersLoading || assigning}>
              <option value="">-- Pilih Pengguna --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.username ?? `User ${u.id}`}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              disabled={assigning}>
              Batal
            </Button>
            <Button
              onClick={handleSaveAssign}
              disabled={assigning || !selectedUserId}>
              {assigning ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const employeeColumns: ColumnDef<TEmployeeWithRelation>[] = [
  { accessorKey: "name", header: "Nama" },
  {
    accessorKey: "position",
    header: "Jabatan",
    cell: ({ getValue }) => (getValue() as string | null | undefined) ?? "-",
  },
  {
    accessorKey: "is_active",
    header: "Aktif",
    cell: ({ getValue }) => ((getValue() as number) ? "Ya" : "Tidak"),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <EmployeeActionsCell row={row as any} />,
  },
];
