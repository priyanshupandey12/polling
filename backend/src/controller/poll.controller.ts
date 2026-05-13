import type { Request, Response } from 'express';
import ApiError from '../utils/error.js';
import { createPollService,getPollByIdService, publishPollService } from '../services/poll.services.js';
import Poll from '../models/poll.model.js';
import Question from '../models/questions.model.js';



export const  createPoll = async (req: Request, res: Response) => {
    const userId=req.user?.userId;


   if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const { title, desc, isAnonymous, expiresAt } = req.body;

  const result = await createPollService(userId, {
    title,
    desc,
    isAnonymous,
    expiresAt:new Date(expiresAt)
  });

  res.status(201).json({
    success: true,
    data: result,
  });
}


export const getPollById = async (req: Request, res: Response) => {
  const pollId = req.params.pollId as string;

  const result = await getPollByIdService(pollId);

  res.status(200).json({
    success: true,
    data: result,
  });
};


export const publishPoll = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const pollId = req.params.pollId as string;

  const poll = await publishPollService(pollId, userId);

 
  res.status(200).json({
    success: true,
    message: "Poll published successfully",
    data: poll,
  });
};


export const getUserPolls = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const polls = await Poll.find({ creatorId: userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: polls });
};

export const getPollDetail = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const pollId = req.params.pollId as string;

  const poll = await Poll.findById(pollId);
  if (!poll) throw ApiError.notfound("Poll not found");


  if (poll.creatorId.toString() !== userId) {
    throw ApiError.forbidden("Not allowed");
  }

  const questions = await Question.find({ pollId });

  res.status(200).json({
    success: true,
    data: { poll, questions }
  });
};