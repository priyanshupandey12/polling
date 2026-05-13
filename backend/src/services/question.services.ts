import type { CreateQuestionInput } from '../types/question.type.js';
import Question from '../models/questions.model.js';
import ApiError from '../utils/error.js';
import Poll from '../models/poll.model.js';



export const createQuestionService = async (userId: string, pollId: string,questionData: CreateQuestionInput) => {
const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }


  if (poll.creatorId.toString() !== userId) {
    throw ApiError.forbidden("You are not allowed to add questions to this poll");
  }


  if (poll.status !== "active") {
    throw ApiError.badRequest("Cannot add questions to a closed or published poll");
  }

  const question = await Question.create({
    pollId,
    questionText: questionData.questionText,
    isRequired: questionData.isRequired,
    options: questionData.options,
  });

  return question;
}