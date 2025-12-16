"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { TAttendance } from "@/schemas/attendance-schema";
import { FormAttendanceSchema, type TAttendanceForm } from "@/schemas/attendance-schema";
import { useCreateAttendance, useUpdateAttendance } from "@/hooks/use-attendance";
import AttendanceForm from "./attendance-form";

type Props = {
  isCreate: boolean;
  attendance: Partial<TAttendance>;
};

export default function AttendanceUpsertForm({ isCreate, attendance }: Props) {
  const createMut = useCreateAttendance();
  const updateMut = useUpdateAttendance();

  const isSubmitting =
    (createMut as any).isPending ||
    (createMut as any).isLoading ||
    (updateMut as any).isPending ||
    (updateMut as any).isLoading;

  const form = useForm<TAttendanceForm>({
    resolver: zodResolver(FormAttendanceSchema),
    defaultValues: {
      employee_id: attendance.employee_id ?? 0,
      date: attendance.date ?? "",
      check_in_time: attendance.check_in_time ?? "",
      check_out_time: attendance.check_out_time ?? "",
      status: attendance.status ?? "",
      description: attendance.description ?? "",
    },
  });

  async function onSubmit(values: TAttendanceForm) {
    if (isCreate) {
      await (createMut as any).mutateAsync(values);
      return;
    }
    if (!attendance.id) return;
    await (updateMut as any).mutateAsync({ id: attendance.id, payload: values });
  }

  return <AttendanceForm form={form} onSubmit={onSubmit} isLoading={isSubmitting} isCreate={isCreate} />;
}
