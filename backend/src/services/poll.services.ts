import type{ CreatePollInput } from "../types/poll.type.js";
import ApiError from "../utils/error.js";
import Poll from "../models/poll.model.js";
import Question from "../models/questions.model.js";
import Response from "../models/response.model.js";

export const createPollService = async (userId: string, pollData: CreatePollInput) => {
   const { title, desc, isAnonymous, expiresAt } = pollData;

    if (new Date(expiresAt) <= new Date()) {
    throw ApiError.badRequest("Expiry date must be in the future");
    }

    const poll = await Poll.create({
    title,
    desc,
    isAnonymous,
    expiresAt,
    creatorId: userId,
  });

  return poll;
  
}

export const getPollByIdService = async (pollId: string) => {
    const poll = await Poll.findById(pollId);
  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  // ✅ Expiry check
  if (poll.status === "active" && new Date() > new Date(poll.expiresAt)) {
    poll.status = "closed";
    await poll.save();
  }

  const questions = await Question.find({ pollId });

  // ✅ Published → results bhi bhejo
  if (poll.status === "published") {
    const responses = await Response.find({ pollId });

    const questionSummaries = questions.map((question) => {
      const allAnswers = responses.flatMap((r) =>
        r.answers.filter(
          (a) => a.questionId.toString() === question._id.toString()
        )
      );

      const optionCounts = question.options.reduce(
        (acc: Record<string, number>, option: string) => {
          acc[option] = allAnswers.filter(
            (a) => a.selectedOption === option
          ).length;
          return acc;
        },
        {}
      );

      return {
        questionId: question._id,
        questionText: question.questionText,
        isRequired: question.isRequired,
        options: question.options,         // ✅ Options include karo
        totalAnswered: allAnswers.length,
        optionCounts,
      };
    });

    return {
      poll,
      questions: questionSummaries,
      totalResponses: responses.length,
    };
  }

  // ✅ Active/Closed → questions with options bhejo
  return {
    poll,
    questions: questions.map((q) => ({
      _id: q._id,
      pollId: q.pollId,
      questionText: q.questionText,
      isRequired: q.isRequired,
      options: q.options,                  // ✅ Options include karo
    })),
  };
};


export const publishPollService = async (pollId: string, userId: string) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  if (poll.creatorId.toString() !== userId) {
    throw ApiError.forbidden("You are not allowed to publish this poll");
  }

  if (poll.status === "published") {
    throw ApiError.badRequest("Poll is already published");
  }

  poll.status = "published";
  await poll.save();

  return poll;
};