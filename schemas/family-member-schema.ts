import z from "zod";

import { BaseSchema } from "./base-schema";
import { TResident } from "./resident-schema";

export const FormFamilyMemberSchema = z
  .object({
    relationship: z.string().min(2, {
      message: "Nama kepala keluarga harus diisi minimal 2 karakter",
    }),
    family_card_id: z.number().optional(),
    resident_id: z.number().optional(),
  })
  .merge(BaseSchema);

export type TFamilyMember = z.infer<typeof FormFamilyMemberSchema>;

export type TFamilyMemberWithRelation = TFamilyMember & {
  resident?: TResident;
};
