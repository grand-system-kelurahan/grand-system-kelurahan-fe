import z from "zod";

import { BaseSchema } from "./base-schema";

export const FormLetterTypeSchema = z
  .object({
    letter_code: z.string(),
    letter_name: z.string(),
    description: z.string(),
  })
  .merge(BaseSchema);

export type TLetterType = z.infer<typeof FormLetterTypeSchema>;
