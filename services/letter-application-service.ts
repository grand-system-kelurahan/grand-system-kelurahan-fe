import { api } from "@/config/axios";
import {
  FormLetterApplicationSchema,
  TLetterApplication,
} from "@/schemas/letter-application-schema";

const ENDPOINT = "letter-applications";

export const getAllLetterApplications = async () => {
  const { data } = await api.get(`/${ENDPOINT}`);
  return data;
};

export const getLetterApplicationsByUserId = async (userId: number) => {
  const { data } = await api.get(`/users/${userId}/${ENDPOINT}`);
  return data;
};

export const createLetterApplication = async (payload: TLetterApplication) => {
  const parsed = FormLetterApplicationSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateLetterApplication = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TLetterApplication>;
}) => {
  const parsed = FormLetterApplicationSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteLetterApplication = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
