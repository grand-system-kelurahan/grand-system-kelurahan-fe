import { z } from "zod";

export const FormUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["admin", "pegawai", "user"]),
});

export type TUser = z.infer<typeof FormUserSchema>;
