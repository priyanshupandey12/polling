import api from "../lib/axios";

export const getAnalyticsService = async (pollId: string) => {
  const res = await api.get(`/analytics/${pollId}`);
  return res.data;
};