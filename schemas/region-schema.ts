import z from "zod";

import { BaseSchema } from "./base-schema";

export const FormRegionSchema = z
  .object({
    name: z.string(),
    encoded_geometry: z.string(),
  })
  .merge(BaseSchema);

export type TRegion = z.infer<typeof FormRegionSchema>;
