import { api } from "@/config/axios";
import { FormRegionSchema, TRegion } from "@/schemas/region-schema";

const ENDPOINT = "regions";

export const getAllRegions = async () => {
  const { data } = await api.get(`/${ENDPOINT}`);
  return data;
};

export const createRegion = async (payload: TRegion) => {
  const parsed = FormRegionSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateRegion = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TRegion>;
}) => {
  const parsed = FormRegionSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteRegion = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
