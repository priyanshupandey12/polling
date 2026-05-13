import type { Request, Response } from "express";
import { submitResponseService } from "../services/response.services.js";
import ApiError from "../utils/error.js";


export const submitResponse = async (req: Request, res: Response) => {
  const pollId = req.params.pollId as string;

  if (!pollId) {
    throw ApiError.badRequest("Poll ID is required");
  }


  const ipAddress =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "";


  const userId = req.user?.userId || null;

  const { answers } = req.body;

  const response = await submitResponseService(pollId, userId, ipAddress, {
    answers,
  });



  res.status(201).json({
    success: true,
    message: "Response submitted successfully",
    data: response,
  });
};