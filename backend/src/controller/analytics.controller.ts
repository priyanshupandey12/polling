import type { Request, Response } from "express";
import { getAnalyticsService } from "../services/analytics.services.js";
import ApiError from "../utils/error.js";

export const getAnalytics = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const pollId = req.params.pollId as string;

  const analytics = await getAnalyticsService(pollId, userId);

  res.status(200).json({
    success: true,
    data: analytics,
  });
};