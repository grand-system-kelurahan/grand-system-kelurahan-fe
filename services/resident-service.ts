import { api } from "@/config/axios";
import { FormResidentSchema, TResident } from "@/schemas/resident-schema";

const ENDPOINT = "residents";

export const getAllResidents = async () => {
  const { data } = await api.get(`/${ENDPOINT}`);
  return data;
};

export const getResidentById = async (id: number) => {
  const { data } = await api.get(`/${ENDPOINT}/${id}`);
  return data;
};

export const createResident = async (payload: TResident) => {
  const parsed = FormResidentSchema.partial().safeParse(payload);
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
