"use client";

import { Button } from "@/components/ui/button";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useAttendanceStore } from "@/stores/use-attendance-store";
import { useDeleteAttendance } from "@/hooks/use-attendance";
import type { TAttendance } from "@/schemas/attendance-schema";

type Props = {
  attendance: Partial<TAttendance> & { id?: number };
  onDeleted?: () => void;
};

export default function DeleteAttendanceForm({ attendance, onDeleted }: Props) {
  const del = useDeleteAttendance();
  const { closeDialog } = useIsDialogOpenStore();
  const { deleteSelectedData } = useAttendanceStore();

  const isDeleting = (del as any).isPending ?? (del as any).isLoading ?? false;

  const handleDelete = () => {
    if (!attendance?.id) return;
    del.mutate(attendance.id, {
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
        Menghapus Absensi ID: <strong>{attendance?.id ?? "-"}</strong>
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
