import Response from "../models/response.model.js";
import Poll from "../models/poll.model.js";
import Question from "../models/questions.model.js";
import ApiError from "../utils/error.js";

export const getAnalyticsService = async (pollId: string, userId: string) => {
  // ✅ 1 — Poll exist karta hai?
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  // ✅ 2 — Sirf creator dekh sake
  if (poll.creatorId.toString() !== userId) {
    throw ApiError.forbidden("You are not allowed to view analytics");
  }

  // ✅ 3 — Saare responses fetch karo
  const responses = await Response.find({ pollId });

  // ✅ 4 — Total responses count
  const totalResponses = responses.length;

  // ✅ 5 — Participation insights
  const authenticatedCount = responses.filter((r) => r.userId !== null).length;
  const anonymousCount = responses.filter((r) => r.userId === null).length;

  // ✅ 6 — Questions fetch karo
  const questions = await Question.find({ pollId });

  // ✅ 7 — Har question ka summary nikalo
  const questionSummaries = questions.map((question) => {
    // Is question ke saare answers
    const allAnswers = responses.flatMap((r) =>
      r.answers.filter(
        (a) => a.questionId.toString() === question._id.toString()
      )
    );

    // Har option ka count
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
      totalAnswered: allAnswers.length,
      optionCounts,
    };
  });

  return {
    pollId,
    title: poll.title,
    status: poll.status,
    totalResponses,
    participation: {
      authenticated: authenticatedCount,
      anonymous: anonymousCount,
    },
    questions: questionSummaries,
  };
};