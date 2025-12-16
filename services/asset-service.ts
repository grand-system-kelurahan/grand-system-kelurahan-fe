import { api } from "@/config/axios";
import { FormAssetSchema, TAsset } from "@/schemas/asset-schema";

const ENDPOINT = "assets";

export const getAllAssets = async () => {
  const { data } = await api.get(`/${ENDPOINT}?with_pagination=false`);
  return data;
};

export const getAssetById = async (id: number) => {
  const { data } = await api.get(`/${ENDPOINT}/${id}`);
  return data;
};

export const createAsset = async (payload: TAsset) => {
  const parsed = FormAssetSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateAsset = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TAsset>;
}) => {
  const parsed = FormAssetSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);

  return data;
};

export const deleteAsset = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
