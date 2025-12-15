import z from "zod";

import { BaseSchema } from "./base-schema";
import { TFamilyMemberWithRelation } from "./family-member-schema";
import { TRegion } from "./region-schema";

export const FormAssetSchema = z
  .object({
    asset_code: z.string(),
    asset_name: z.string(),
    description: z.string().optional(),
    asset_type: z.enum(["item", "room"]),
    total_stock: z.number(),
    available_stock: z.number(),
    location: z.string(),
    asset_status: z.enum(["active", "inactive"]),
  })
  .merge(BaseSchema);

export type TAsset = z.infer<typeof FormAssetSchema>;

export type TAssetWithRelation = TAsset & {};
