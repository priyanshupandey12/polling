import api from "../lib/axios";
import { useAuthStore } from "../store/auth.store";

export const registerService = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  useAuthStore.getState().setUser(res.data.user);
  return res.data;
};

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  useAuthStore.getState().setUser(res.data.user);
  return res.data;
};

export const logoutService = async () => {
  await api.post("/auth/logout");
  useAuthStore.getState().logout();
};

export const getCurrentUserService = async () => {
  const res = await api.get("/auth/me");
  useAuthStore.getState().setUser(res.data.user);
  return res.data;
};