import axios from "axios";        // ✅ Original axios package
import api from "../lib/axios";   // ✅ Custom api instance

export const getPollByIdService = async (pollId: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/polls/${pollId}`,
    { withCredentials: true }
  );
  return res.data;
};



export const createPollService = async (data: {
  title: string;
  desc?: string;
  isAnonymous: boolean;
  expiresAt: Date;
}) => {
  const res = await api.post("/polls", data);
  return res.data;
};

export const getUserPollsService = async () => {
  const res = await api.get("/polls");
  return res.data;
};

export const publishPollService = async (pollId: string) => {
  const res = await api.patch(`/polls/${pollId}/publish`);
  return res.data;
};