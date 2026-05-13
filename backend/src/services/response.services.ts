import Response from "../models/response.model.js";
import Poll from "../models/poll.model.js";
import Question from "../models/questions.model.js";
import ApiError from "../utils/error.js";
import type { SubmitResponseInput } from "../types/submit.type.js";
import { getIO } from "../utils/socket.js";


export const submitResponseService = async (
  pollId: string,
  userId: string | null,
  ipAddress: string,
  data: SubmitResponseInput
) => {
  
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }


  if (poll.status !== "active") {
    throw ApiError.badRequest("Poll is no longer active");
  }


  if (new Date() > new Date(poll.expiresAt)) {
    throw ApiError.badRequest("Poll has expired");
  }


  if (poll.isAnonymous) {

    const existing = await Response.findOne({ pollId, ipAddress });
    if (existing) {
      throw ApiError.badRequest("You have already submitted a response");
    }
  } else {

    if (!userId) {
      throw ApiError.unauthorized("You must be logged in to respond");
    }
    const existing = await Response.findOne({ pollId, userId });
    if (existing) {
      throw ApiError.badRequest("You have already submitted a response");
    }
  }

  const questions = await Question.find({ pollId });

  const requiredQuestions = questions.filter((q) => q.isRequired);

  const answeredQuestionIds = data.answers.map((a) => a.questionId.toString());

  const missingRequired = requiredQuestions.filter(
    (q) => !answeredQuestionIds.includes(q._id.toString())
  );

  if (missingRequired.length > 0) {
    throw ApiError.badRequest(
      `These required questions are not answered: ${missingRequired
        .map((q) => q.questionText)
        .join(", ")}`
    );
  }


  const response = await Response.create({
    pollId,
    userId: poll.isAnonymous ? null : userId,
    ipAddress: poll.isAnonymous ? ipAddress : null,
    answers: data.answers,
  });

  const io = getIO();
  io.to(pollId).emit("new-response", {
    totalResponses: await Response.countDocuments({ pollId }),
  });

  return response;
};