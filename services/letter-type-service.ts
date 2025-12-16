import { api } from "@/config/axios";
import {
  FormLetterTypeSchema,
  TLetterType,
} from "@/schemas/letter-type-schema";

const ENDPOINT = "letter-types";

export const getAllLetterTypes = async () => {
  const { data } = await api.get(`/${ENDPOINT}`);
  return data;
};

export const createLetterType = async (payload: TLetterType) => {
  const parsed = FormLetterTypeSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateLetterType = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TLetterType>;
}) => {
  const parsed = FormLetterTypeSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteLetterType = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
