import axios from "axios";
import { clearAuthCookies, getTokenDecoded } from "@/lib/auth-utils";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getTokenDecoded(); // ✅ decode token cookie (%7C -> |)
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        clearAuthCookies();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
