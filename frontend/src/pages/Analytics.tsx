import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAnalyticsService } from "../services/anylatics.services";
import { publishPollService } from "../services/poll.services";
import { useSocket } from "../hooks/useSocket";
import type { Analytics } from "../types/index";

// ─── Icon ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 border-2 border-white font-mono text-xs uppercase flex items-center gap-3 z-50">
      <Icon name="check_circle" className="text-white" />
      {message}
    </div>
  );
}

// ─── Option Bar ───────────────────────────────────────────────────────────────
function OptionBar({
  option,
  count,
  total,
  isWinner,
}: {
  option: string;
  count: number;
  total: number;
  isWinner: boolean;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-sm">
        <span className={`font-bold ${isWinner ? "text-black" : "text-gray-500"}`}>
          {option}
          {isWinner && <Icon name="emoji_events" className="text-sm ml-1" />}
        </span>
        <span className="text-gray-500">
          {count} votes ({percentage}%)
        </span>
      </div>
      <div className="h-8 w-full bg-gray-100 border border-gray-200">
        <div
          className={`h-full transition-all duration-700 ${isWinner ? "bg-black" : "bg-gray-300"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
export default function Analytics() {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ WebSocket — real time updates
  useSocket(pollId!, (data) => {
    setAnalytics((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalResponses: data.totalResponses,
      };
    });

    // ✅ Analytics refresh karo
    fetchAnalytics();
  });

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalyticsService(pollId!);
      setAnalytics(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) fetchAnalytics();
  }, [pollId]);

  // ✅ Toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Publish poll
  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishPollService(pollId!);
      setAnalytics((prev) => prev ? { ...prev, status: "published" } : prev);
      showToast("POLL PUBLISHED");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <Icon name="sync" className="animate-spin text-4xl" />
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <div className="border-4 border-black p-12 text-center space-y-4">
          <Icon name="error" className="text-4xl" />
          <h1 className="text-2xl font-bold">{error || "Something went wrong"}</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="bg-[#fbf9f9] text-black min-h-screen flex flex-col">

        {/* ─── Navbar ──────────────────────────────────────────────────────── */}
        <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Icon name="ballot" className="text-3xl" />
              <span className="text-2xl font-bold tracking-tight">PollPulse</span>
            </Link>
            <Link
              to="/dashboard"
              className="font-mono text-xs uppercase flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
            >
              <Icon name="arrow_back" className="text-sm" />
              Dashboard
            </Link>
          </div>
        </nav>

        <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-16 space-y-12">

          {/* ─── Header ────────────────────────────────────────────────────── */}
          <header className="border-b-2 border-black pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                Analytics
              </p>
              {/* Status Badge */}
              {analytics.status === "active" && (
                <span className="font-mono text-xs px-3 py-1 border border-black uppercase flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
              {analytics.status === "closed" && (
                <span className="font-mono text-xs px-3 py-1 border border-gray-400 text-gray-500 uppercase">
                  Closed
                </span>
              )}
              {analytics.status === "published" && (
                <span className="font-mono text-xs px-3 py-1 border-2 border-black bg-black text-white uppercase">
                  Published
                </span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter">
              {analytics.title}
            </h1>

            {/* Publish Button — Sirf closed pe */}
            {analytics.status === "closed" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wide flex items-center gap-2 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Icon name="sync" className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Icon name="publish" />
                    Publish Results
                  </>
                )}
              </button>
            )}
          </header>

          {/* ─── Stats ─────────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black p-8 bg-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs text-gray-500 uppercase">
                Total Responses
              </span>
              <span className="text-6xl font-extrabold leading-none">
                {analytics.totalResponses}
              </span>
            </div>
            <div className="border-2 border-black p-8 bg-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs text-gray-500 uppercase">
                Authenticated
              </span>
              <span className="text-6xl font-extrabold leading-none">
                {analytics.participation.authenticated}
              </span>
            </div>
            <div className="border-2 border-black p-8 bg-black text-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs uppercase">
                Anonymous
              </span>
              <span className="text-6xl font-extrabold leading-none">
                {analytics.participation.anonymous}
              </span>
            </div>
          </section>

          {/* ─── Questions Analytics ────────────────────────────────────────── */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold border-b-2 border-black pb-4">
              Question Breakdown
            </h2>

            {analytics.questions.map((q, index) => {
              const total = Object.values(q.optionCounts).reduce((a, b) => a + b, 0);
              const maxCount = Math.max(...Object.values(q.optionCounts), 0);

              return (
                <div key={q.questionId} className="border-2 border-black bg-white p-8 space-y-6">

                  {/* Question Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-400 uppercase">
                        Question {index + 1}
                        {q.isRequired && (
                          <span className="text-red-500 ml-1">*Required</span>
                        )}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {q.totalAnswered} answered
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{q.questionText}</h3>
                  </div>

                  {/* Option Bars */}
                  <div className="space-y-4">
                    {q?.options?.map((option) => {
                      const count = q.optionCounts[option] || 0;
                      const isWinner = count === maxCount && count > 0;
                      return (
                        <OptionBar
                          key={option}
                          option={option}
                          count={count}
                          total={total}
                          isWinner={isWinner}
                        />
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </section>

        </main>

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t-2 border-black mt-16">
          <div className="max-w-5xl mx-auto px-8 py-8 flex justify-between items-center">
            <span className="font-bold text-xl">PollPulse</span>
            <p className="text-gray-500 text-sm">© 2024 PollPulse. Clarity in every vote.</p>
          </div>
        </footer>

        {/* ─── Toast ───────────────────────────────────────────────────────── */}
        {toast && <Toast message={toast} />}

      </div>
    </>
  );
}