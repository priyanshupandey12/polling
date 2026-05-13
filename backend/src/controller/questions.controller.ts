import type { Request, Response } from "express";
import { createQuestionService } from "../services/question.services.js";
import ApiError from "../utils/error.js";


export const createQuestion= async (req: Request, res: Response) => {
    const userId = req.user?.userId;

  if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

   const pollId = req.params.pollId as string;
    if (!pollId) {
    throw ApiError.badRequest("Poll ID is required");
  }
  const { questionText, isRequired, options } = req.body;

  const question = await createQuestionService(userId, pollId, {
    questionText,
    isRequired,
    options,
  });

  res.status(201).json({
    success: true,
    message: "Question created successfully",
    data: question,
  });
}