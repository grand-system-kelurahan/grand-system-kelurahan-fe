import { z } from "zod";

export const AttendanceSchema = z.object({
  id: z.number().optional(),
  employee_id: z.coerce.number().min(1),
  date: z.string().min(1),
  check_in_time: z.string().optional().nullable(),
  check_out_time: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const FormAttendanceSchema = z.object({
  employee_id: z.coerce.number().min(1),
  date: z.string().min(1),
  check_in_time: z.string().optional().nullable(),
  check_out_time: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type TAttendance = z.infer<typeof AttendanceSchema>;
export type TAttendanceForm = z.infer<typeof FormAttendanceSchema>;
