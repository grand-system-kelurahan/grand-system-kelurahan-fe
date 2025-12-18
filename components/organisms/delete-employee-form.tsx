"use client";

import { useDeleteEmployee } from "@/hooks/use-employees";
import type { TEmployeeWithRelation } from "@/schemas/employee-schema";
import { Button } from "../ui/button";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useEmployeeStore } from "@/stores/use-employee-store";

type Props = {
  employee: Partial<TEmployeeWithRelation> & { id?: number; name?: string };
  onDeleted?: () => void;
};

export default function DeleteEmployeeForm({ employee, onDeleted }: Props) {
  const deleteMutation = useDeleteEmployee();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useEmployeeStore();

  const isDeleting =
    (deleteMutation as any).isPending ??
    (deleteMutation as any).isLoading ??
    false;

  const handleDelete = () => {
    if (!employee?.id) return;
    deleteMutation.mutate(employee.id, {
      onSuccess: () => {
        closeDialog();
        deleteSelectedData();
        onDeleted?.();
      },
    } as any);
  };

  const handleCancel = () => {
    closeDialog();
    deleteSelectedData();
  };

  return (
    <div className="space-y-4">
      <div>
        Menghapus: <strong>{employee?.name ?? "-"}</strong>
      </div>

      <div className="flex gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Menghapus..." : "Hapus"}
        </Button>
        <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
          Batal
        </Button>
      </div>
    </div>
  );
}
