import { api } from "@/config/axios";
import {
  FormFamilyCardSchema,
  TFamilyCard,
} from "@/schemas/family-card-schema";

const ENDPOINT = "family-cards";

export const getAllFamilyCards = async () => {
  const { data } = await api.get(`/${ENDPOINT}?with_pagination=false`);
  return data;
};

export const getFamilyCardById = async (id: number) => {
  const { data } = await api.get(`/${ENDPOINT}/${id}`);
  return data;
};

export const createFamilyCard = async (payload: TFamilyCard) => {
  const parsed = FormFamilyCardSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateFamilyCard = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TFamilyCard>;
}) => {
  const parsed = FormFamilyCardSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteFamilyCard = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
