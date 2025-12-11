import { api } from "@/config/axios";
import {
  FormLoginSchema,
  FormRegisterSchema,
  TLogin,
  TRegister,
} from "@/schemas/auth-schema";

export const register = async (payload: TRegister) => {
  const parsed = FormRegisterSchema.parse(payload);
  const { data } = await api.post("/register", parsed);
  return data;
};

export const login = async (payload: TLogin) => {
  const parsed = FormLoginSchema.parse(payload);
  const { data } = await api.post("/login", parsed);
  return data;
};
