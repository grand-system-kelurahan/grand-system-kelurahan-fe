"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { TEmployeeWithRelation } from "@/schemas/employee-schema";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees";

import EmployeeForm from "./employee-form";

const EmployeeFormSchema = z.object({
  employee_number: z.string().min(1, "Nomor pegawai wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  position: z.string().optional().nullable(),
  is_active: z.coerce.number().default(1),
  user_id: z.coerce.number().optional().nullable(),
  resident_id: z.coerce.number().optional().nullable(),
  region_id: z.coerce.number().optional().nullable(),
});

export type TEmployeeFormValues = z.infer<typeof EmployeeFormSchema>;

type Props = {
  isCreate: boolean;
  employee: Partial<TEmployeeWithRelation>;
};

export default function EmployeeUpsertForm({ isCreate, employee }: Props) {
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const isSubmitting =
    (createMutation as any).isPending ||
    (createMutation as any).isLoading ||
    (updateMutation as any).isPending ||
    (updateMutation as any).isLoading;

  const form = useForm<TEmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      employee_number: employee.employee_number ?? "",
      name: employee.name ?? "",
      position: employee.position ?? "",
      is_active: employee.is_active ?? 1,
      user_id: employee.user_id ?? undefined,
      resident_id: employee.resident_id ?? undefined,
      region_id: (employee as any).region_id ?? undefined,
    },
  });

  async function onSubmit(values: TEmployeeFormValues) {
    if (isCreate) {
      await (createMutation as any).mutateAsync(values);
      return;
    }
    if (!employee.id) return;
    await (updateMutation as any).mutateAsync({ id: employee.id, payload: values });
  }

  return <EmployeeForm form={form as any} onSubmit={onSubmit} isLoading={isSubmitting} isCreate={isCreate} />;
}
