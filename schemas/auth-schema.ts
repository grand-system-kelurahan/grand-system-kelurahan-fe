import { z } from "zod";

export const FormRegisterSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const FormLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TRegister = z.infer<typeof FormRegisterSchema>;
export type TLogin = z.infer<typeof FormLoginSchema>;
