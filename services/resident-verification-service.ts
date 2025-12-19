import { api } from "@/config/axios";
import { FormResidentSchema, TResident } from "@/schemas/resident-schema";
import {
  FormResidentVerificationSchema,
  TResidentVerification,
} from "@/schemas/resident-verification-schema";

const ENDPOINT = "resident-verifications";

export const getAllResidentVerifications = async () => {
  const { data } = await api.get(`/${ENDPOINT}?with_pagination=false`);
  return data;
};

export const getResidentVerificationById = async (id: number) => {
  const { data } = await api.get(`/${ENDPOINT}/${id}`);
  return data;
};

export const createResidentVerification = async (
  payload: TResidentVerification
) => {
  const parsed = FormResidentVerificationSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateResident = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TResident>;
}) => {
  const parsed = FormResidentSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteResident = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
