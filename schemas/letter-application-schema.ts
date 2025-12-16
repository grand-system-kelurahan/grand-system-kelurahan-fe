import z from "zod";

import { BaseSchema } from "./base-schema";

export const FormLetterApplicationSchema = z
  .object({
    resident_id: z.number().optional(),
    letter_type_id: z.number().optional(),
    letter_number: z.string().optional(),
    submission_date: z.date().optional(),
    approval_date: z.date().optional(),
    status: z.string().optional(),
    description: z.string().optional(),
  })
  .merge(BaseSchema);

export type TLetterApplication = z.infer<typeof FormLetterApplicationSchema>;
