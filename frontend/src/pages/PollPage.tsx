import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPollByIdService } from "../services/poll.services";
import { submitResponseService } from "../services/response.services";
import { useSocket } from "../hooks/useSocket";
import type { Poll, Question, QuestionSummary } from "../types/index";

// ─── Icon ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
      <Icon name="sync" className="animate-spin text-4xl" />
    </div>
  );
}

// ─── Poll Closed ──────────────────────────────────────────────────────────────
function PollClosed({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#fbf9f9] flex items-center justify-center px-6">
      <div className="max-w-md w-full border-4 border-black bg-white p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto">
          <Icon name="lock" className="text-white text-4xl" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tighter">{title}</h1>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
          This poll has closed
        </p>
        <p className="text-gray-400 text-sm">
          No longer accepting responses.
        </p>
      </div>
    </div>
  );
}

// ─── Poll Results ─────────────────────────────────────────────────────────────
function PollResults({
  title,
  desc,
  questions,
  totalResponses,
}: {
  title: string;
  desc?: string;
  questions: QuestionSummary[];
  totalResponses: number;
}) {
  return (
    <div className="bg-[#fbf9f9] min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-2">
          <Icon name="ballot" className="text-3xl" />
          <span className="text-2xl font-bold tracking-tight">PollPulse</span>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-16 space-y-12">

        {/* Header */}
        <header className="border-b-2 border-black pb-8 space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 border border-black px-3 py-1">
            Results Published
          </span>
          <h1 className="text-4xl font-extrabold tracking-tighter">{title}</h1>
          {desc && <p className="text-gray-500">{desc}</p>}
          <div className="flex items-center gap-2 font-mono text-sm text-gray-500">
            <Icon name="people" className="text-sm" />
            <span>{totalResponses} Total Responses</span>
          </div>
        </header>

        {/* Questions Results */}
        <div className="space-y-8">
          {questions.map((q, index) => {
            const total = Object.values(q.optionCounts).reduce((a, b) => a + b, 0);
            const maxCount = Math.max(...Object.values(q.optionCounts));

            return (
              <div key={q.questionId} className="border-2 border-black bg-white p-8 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-gray-400 uppercase">
                    Question {index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{q.questionText}</h3>
                  <p className="font-mono text-xs text-gray-500">
                    {q.totalAnswered} answered
                  </p>
                </div>

                {/* Option Bars */}
                <div className="space-y-4">
                  {q.options.map((option) => {
                    const count = q.optionCounts[option] || 0;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    const isWinner = count === maxCount && count > 0;

                    return (
                      <div key={option} className="space-y-1">
                        <div className="flex justify-between font-mono text-sm">
                          <span className={`font-bold ${isWinner ? "text-black" : "text-gray-500"}`}>
                            {option}
                            {isWinner && (
                              <Icon name="emoji_events" className="text-sm ml-1 text-black" />
                            )}
                          </span>
                          <span>{count} votes ({percentage}%)</span>
                        </div>
                        <div className="h-8 w-full bg-gray-100 border border-gray-200">
                          <div
                            className={`h-full transition-all duration-500 ${isWinner ? "bg-black" : "bg-gray-300"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

// ─── Poll Form ────────────────────────────────────────────────────────────────
function PollForm({
  poll,
  questions,
}: {
  poll: Poll;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResponses, setTotalResponses] = useState(0);

  // ✅ WebSocket — real time response count
  useSocket(poll._id, (data) => {
    setTotalResponses(data.totalResponses);
  });

  const handleSelect = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    // ✅ Required questions check
    const requiredQuestions = questions.filter((q) => q.isRequired);
    const missing = requiredQuestions.filter((q) => !answers[q._id]);

    if (missing.length > 0) {
      setError(`Please answer all required questions`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await submitResponseService(poll._id, {
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] flex items-center justify-center px-6">
        <div className="max-w-md w-full border-4 border-black bg-white p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto">
            <Icon name="check_circle" className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">
            Response Submitted!
          </h1>
          <p className="text-gray-500">
            Thank you for participating in this poll.
          </p>
          {totalResponses > 0 && (
            <p className="font-mono text-sm text-gray-400">
              {totalResponses} total responses so far
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbf9f9] min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-2">
          <Icon name="ballot" className="text-3xl" />
          <span className="text-2xl font-bold tracking-tight">PollPulse</span>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-16 space-y-12">

        {/* Header */}
        <header className="border-b-2 border-black pb-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase px-3 py-1 border border-black">
              {poll.isAnonymous ? "Anonymous Poll" : "Authenticated Poll"}
            </span>
            {totalResponses > 0 && (
              <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                <Icon name="people" className="text-sm" />
                {totalResponses} responses
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter">{poll.title}</h1>
          {poll.desc && <p className="text-gray-500">{poll.desc}</p>}
          <p className="font-mono text-xs text-gray-400">
            Expires: {new Date(poll.expiresAt).toLocaleString()}
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="p-4 border-2 border-red-500 bg-red-50 text-red-600 font-mono text-sm">
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q._id} className="border-2 border-black bg-white p-8 space-y-6">

              <div className="space-y-1">
                <span className="font-mono text-xs text-gray-400 uppercase">
                  Question {index + 1}
                  {q.isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </span>
                <h3 className="text-xl font-bold">{q.questionText}</h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((option) => {
                  const isSelected = answers[q._id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(q._id, option)}
                      className={`w-full p-4 border-2 text-left font-mono text-sm transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-gray-50"
                      }`}
                    >
                      <span className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-white" : "border-black"}`}>
                        {isSelected && <Icon name="check" className="text-sm text-white" />}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-4 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wide text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Icon name="sync" className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Icon name="send" />
              Submit Response
            </>
          )}
        </button>

      </main>
    </div>
  );
}

// ─── Main PollPage ────────────────────────────────────────────────────────────
export default function PollPage() {
  const { pollId } = useParams<{ pollId: string }>();
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchPoll = async () => {
    try {
      const res = await getPollByIdService(pollId!);

      console.log("Poll data:", res); // ✅ Debug ke liye

      setPoll(res.data.poll);

      if (res.data.poll.status === "published") {
        setQuestionSummaries(res.data.questions);
        setTotalResponses(res.data.totalResponses);
      } else {
        setQuestions(res.data.questions);
      }
    } catch (err: any) {
      console.error("Error:", err); // ✅ Debug ke liye
      setError(err.response?.data?.message || "Poll not found");
    } finally {
      setLoading(false);
    }
  };

  if (pollId) fetchPoll();
}, [pollId]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <div className="border-4 border-black p-12 text-center space-y-4">
          <Icon name="error" className="text-4xl" />
          <h1 className="text-2xl font-bold">{error}</h1>
        </div>
      </div>
    );
  }

  if (!poll) return null;


  if (poll.status === "closed") return <PollClosed title={poll.title} />;

  if (poll.status === "published") {
    return (
      <PollResults
        title={poll.title}
        desc={poll.desc}
        questions={questionSummaries}
        totalResponses={totalResponses}
      />
    );
  }

  return <PollForm poll={poll} questions={questions} />;
}