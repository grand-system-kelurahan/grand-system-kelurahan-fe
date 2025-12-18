import { api } from "@/config/axios";

const ENDPOINT = "reports";

export const getReportsPublic = async () => {
  const { data } = await api.get(`/${ENDPOINT}/public`);
  return data;
};

export const getReportsWithAuth = async () => {
  const { data } = await api.get(`/${ENDPOINT}`);
  return data;
};
