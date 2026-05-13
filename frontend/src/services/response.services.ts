import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export const submitResponseService = async (
  pollId: string,
  data: {
    answers: {
      questionId: string;
      selectedOption: string;
    }[];
  }
) => {
  const res = await axios.post(
    `${BASE_URL}/responses/${pollId}`,
    data,
    { withCredentials: true } 
  );
  return res.data;
};