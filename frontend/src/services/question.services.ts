import api from "../lib/axios";

export const createQuestionService = async (
  pollId: string,
  data: {
    questionText: string;
    isRequired: boolean;
    options: string[];
  }
) => {
  const res = await api.post(`/questions/${pollId}`, data);
  return res.data;
};