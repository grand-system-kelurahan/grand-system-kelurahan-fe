import z from "zod";

import { BaseSchema } from "./base-schema";
import { TLetterType } from "./letter-type-schema";
import { TResident } from "./resident-schema";

export const FormLetterApplicationSchema = z
  .object({
    resident_id: z.number().optional(),
    letter_type_id: z.number().optional(),
    letter_number: z.string().optional(),
    submission_date: z.date().optional(),
    approval_date: z.date().optional(),
    status: z.string().optional(),
    description: z.string().optional(),
    approved_by: z.number().optional(),
    submitted_by: z.number().optional(),
  })
  .merge(BaseSchema);

export type TLetterApplication = z.infer<typeof FormLetterApplicationSchema>;
export type TLetterApplicationWithRelation = TLetterApplication & {
  resident: TResident;
  letter_type: TLetterType;
};
