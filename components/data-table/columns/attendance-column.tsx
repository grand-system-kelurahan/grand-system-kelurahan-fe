import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { TAttendance } from "@/schemas/attendance-schema";
import { useAttendanceStore } from "@/stores/use-attendance-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useClockIn, useClockOut } from "@/hooks/use-attendance";
import { useEmployees } from "@/hooks/use-employees";

type CellProps = { row: { original: TAttendance } };

function nowTimeHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function AttendanceActionsCell({ row }: CellProps) {
  const att = row.original;

  const { setSelectedData } = useAttendanceStore();
  const dialogStore = useIsDialogOpenStore() as any;

  const clockIn = useClockIn();
  const clockOut = useClockOut();

  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);
  const [timeIn, setTimeIn] = useState(nowTimeHHMM());
  const [timeOut, setTimeOut] = useState(nowTimeHHMM());

  const isClockingIn =
    (clockIn as any).isPending ?? (clockIn as any).isLoading ?? false;
  const isClockingOut =
    (clockOut as any).isPending ?? (clockOut as any).isLoading ?? false;

  const openDeleteDialog = () => {
    setSelectedData(att);
    if (typeof dialogStore.openDialog === "function")
      return dialogStore.openDialog("delete");
    if (typeof dialogStore.setDialogType === "function")
      return dialogStore.setDialogType("delete");
  };

  const submitClockIn = () => {
    if (!att.employee_id) return;
    clockIn.mutate({ employee_id: Number(att.employee_id), time: timeIn }, {
      onSuccess: () => setOpenIn(false),
    } as any);
  };

  const submitClockOut = () => {
    if (!att.employee_id) return;
    clockOut.mutate({ employee_id: Number(att.employee_id), time: timeOut }, {
      onSuccess: () => setOpenOut(false),
    } as any);
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/attendances/${att.id}`}>
        <Button>Detail</Button>
      </Link>

      <Button
        variant="outline"
        onClick={() => setOpenIn(true)}
        disabled={isClockingIn}
      >
        Check-in
      </Button>

      <Button
        variant="outline"
        onClick={() => setOpenOut(true)}
        disabled={isClockingOut}
      >
        Check-out
      </Button>

      <Button variant="destructive" onClick={openDeleteDialog}>
        Hapus
      </Button>

      <Dialog open={openIn} onOpenChange={setOpenIn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-in</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              Employee ID:{" "}
              <span className="font-medium">{att.employee_id}</span>
            </div>
            <Input
              type="time"
              value={timeIn}
              onChange={(e) => setTimeIn(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenIn(false)}
              disabled={isClockingIn}
            >
              Batal
            </Button>
            <Button onClick={submitClockIn} disabled={isClockingIn || !timeIn}>
              {isClockingIn ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openOut} onOpenChange={setOpenOut}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-out</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              Employee ID:{" "}
              <span className="font-medium">{att.employee_id}</span>
            </div>
            <Input
              type="time"
              value={timeOut}
              onChange={(e) => setTimeOut(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenOut(false)}
              disabled={isClockingOut}
            >
              Batal
            </Button>
            <Button
              onClick={submitClockOut}
              disabled={isClockingOut || !timeOut}
            >
              {isClockingOut ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const attendanceColumns: ColumnDef<TAttendance>[] = [
  {
    accessorKey: "employee_id",
    header: "Pegawai",
    cell: ({ getValue }) => (
      <EmployeeNameCell employeeId={Number(getValue() as any)} />
    ),
  },
  { accessorKey: "date", header: "Tanggal" },
  {
    accessorKey: "check_in_time",
    header: "Masuk",
    cell: ({ getValue }) => (getValue() as string | null | undefined) ?? "-",
  },
  {
    accessorKey: "check_out_time",
    header: "Pulang",
    cell: ({ getValue }) => (getValue() as string | null | undefined) ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (getValue() as string | null | undefined) ?? "-",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <AttendanceActionsCell row={row as any} />,
  },
];

function EmployeeNameCell({ employeeId }: { employeeId: number }) {
  const { data } = useEmployees();

  const employees = useMemo(() => {
    if (Array.isArray(data)) return data as any[];
    const list =
      (data as any)?.data?.employees ??
      (data as any)?.employees ??
      (data as any)?.data ??
      [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  const emp = employees.find((e: any) => Number(e.id) === Number(employeeId));
  return <span>{emp?.name ?? `#${employeeId}`}</span>;
}
