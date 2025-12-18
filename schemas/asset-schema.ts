import z from "zod";

import { BaseSchema } from "./base-schema";

export const FormAssetSchema = z
  .object({
    asset_code: z.string(),
    asset_name: z.string(),
    description: z.string().optional(),
    asset_type: z.enum(["item", "room"]),
    total_stock: z.number(),
    location: z.string(),
    asset_status: z.enum(["active", "inactive"]),
    available_stock: z.number().optional(),
    borrowed_stock: z.number().optional(),
  })
  .merge(BaseSchema);

export type TAsset = z.infer<typeof FormAssetSchema>;

export type TAssetWithRelation = TAsset & {};
