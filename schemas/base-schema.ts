import z from "zod";

export const BaseSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
