import z from "zod";

import { BaseSchema } from "./base-schema";
import { TResident } from "./resident-schema";
import { TUser } from "./user-schema";

export const FormResidentVerificationSchema = z
  .object({
    resident_id: z.number().optional(),
    verified_by: z.number().optional(),
    status: z.enum(["pending", "verified", "rejected"]).optional(),
    notes: z.string().optional(),
    verified_data: z.string().optional(),
    verified_at: z.date().optional(),
  })
  .merge(BaseSchema);

export type TResidentVerification = z.infer<
  typeof FormResidentVerificationSchema
>;

export type TResidentVerificationWithRelation = TResidentVerification & {
  resident: TResident;
  verifier: TUser;
};
