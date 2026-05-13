import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../lib/axios";
import type { Poll, Question } from "../types/index";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function PollDetail() {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // ✅ Creator ke liye — api instance (auth chahiye)
        const res = await api.get(`/polls/${pollId}/detail`);
        setPoll(res.data.data.poll);
        setQuestions(res.data.data.questions);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    if (pollId) fetchDetail();
  }, [pollId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(link);
    showToast("LINK COPIED!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <Icon name="sync" className="animate-spin text-4xl" />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <div className="border-4 border-black p-12 text-center space-y-4">
          <Icon name="error" className="text-4xl" />
          <h1 className="text-2xl font-bold">{error}</h1>
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

        {/* Navbar */}
        <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
          <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Icon name="ballot" className="text-3xl" />
              <span className="text-2xl font-bold tracking-tight">PollPulse</span>
            </Link>
            <Link
              to="/dashboard"
              className="font-mono text-xs uppercase flex items-center gap-1 text-gray-500 hover:text-black"
            >
              <Icon name="arrow_back" className="text-sm" />
              Dashboard
            </Link>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16 space-y-12">

          {/* Header */}
          <header className="border-b-2 border-black pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                Poll Detail
              </span>
              {/* Status */}
              <span className={`font-mono text-xs px-3 py-1 border uppercase ${
                poll.status === "active" ? "border-black" :
                poll.status === "closed" ? "border-gray-400 text-gray-500" :
                "bg-black text-white border-black"
              }`}>
                {poll.status}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter">{poll.title}</h1>
            {poll.desc && <p className="text-gray-500">{poll.desc}</p>}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm text-gray-500">
              <div>
                <p className="text-[10px] uppercase font-bold text-black mb-1">Created</p>
                <p>{new Date(poll.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-black mb-1">Expiry</p>
                <p>{new Date(poll.expiresAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-black mb-1">Mode</p>
                <p>{poll.isAnonymous ? "Anonymous" : "Authenticated"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="bg-black text-white px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase font-bold flex items-center gap-2"
              >
                <Icon name="share" className="text-sm" />
                Copy Share Link
              </button>
              <button
                onClick={() => navigate(`/analytics/${pollId}`)}
                className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs uppercase font-bold flex items-center gap-2"
              >
                <Icon name="analytics" className="text-sm" />
                Analytics
              </button>
            </div>
          </header>

          {/* Questions */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-black pb-4">
              Questions ({questions.length})
            </h2>

            {questions.length === 0 ? (
              <div className="border-2 border-dashed border-black p-12 text-center text-gray-500 font-mono text-sm uppercase">
                No questions added yet
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={q._id} className="border-2 border-black bg-white p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-400 uppercase">
                      Question {index + 1}
                    </span>
                    <span className={`font-mono text-xs px-2 py-1 border ${
                      q.isRequired
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-400"
                    }`}>
                      {q.isRequired ? "Required" : "Optional"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold">{q.questionText}</h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex items-center gap-3 p-3 border border-gray-200 bg-gray-50"
                      >
                        <span className="font-mono text-xs text-gray-400 w-6">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="text-sm font-mono">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

        </main>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 border-2 border-white font-mono text-xs uppercase flex items-center gap-3 z-50">
            <Icon name="check_circle" className="text-white" />
            {toast}
          </div>
        )}

      </div>
    </>
  );
}