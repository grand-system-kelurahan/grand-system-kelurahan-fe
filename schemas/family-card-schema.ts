import z from "zod";

import { BaseSchema } from "./base-schema";
import { TFamilyMemberWithRelation } from "./family-member-schema";
import { TRegion } from "./region-schema";

export const FormFamilyCardSchema = z
  .object({
    family_card_number: z.string().min(2, {
      message: "Nomor kartu keluarga harus diisi minimal 2 karakter",
    }),
    head_of_family_name: z.string().min(2, {
      message: "Nama kepala keluarga harus diisi minimal 2 karakter",
    }),
    address: z
      .string()
      .min(2, { message: "Alamat harus diisi minimal 2 karakter" }),
    publication_date: z.date(),
    region_id: z.number().optional(),
  })
  .merge(BaseSchema);

export type TFamilyCard = z.infer<typeof FormFamilyCardSchema>;

export type TFamilyCardWithRelation = TFamilyCard & {
  total_members?: number;
  region?: TRegion;
  family_members?: TFamilyMemberWithRelation[];
};
