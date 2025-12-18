import { api } from "@/config/axios";
import { FormUserSchema, TUser } from "@/schemas/user-schema";

const ENDPOINT = "users";

export const getAllUsers = async () => {
  const { data } = await api.get(`/${ENDPOINT}?with_pagination=false`);
  return data;
};

export const getUserById = async (id: number) => {
  const { data } = await api.get(`/${ENDPOINT}/${id}`);
  return data;
};

export const getUserByName = async (name: string) => {
  const { data } = await api.get(`/${ENDPOINT}?search=${name}`);
  return data;
};

export const createUser = async (payload: TUser) => {
  const parsed = FormUserSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const updateUser = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<TUser>;
}) => {
  const parsed = FormUserSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
