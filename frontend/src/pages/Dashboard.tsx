import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { logoutService } from "../services/auth.services";
import { getUserPollsService, publishPollService } from "../services/poll.services";
import type { Poll } from "../types/index";

// ─── Icon ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Poll["status"] }) {
  if (status === "active") {
    return (
      <span className="font-mono text-xs px-3 py-1 border border-black uppercase">
        Active
      </span>
    );
  }
  if (status === "closed") {
    return (
      <span className="font-mono text-xs px-3 py-1 border border-gray-400 text-gray-500 uppercase">
        Closed
      </span>
    );
  }
  return (
    <span className="font-mono text-xs px-3 py-1 border-2 border-black bg-black text-white uppercase">
      Published
    </span>
  );
}

// ─── Poll Card ────────────────────────────────────────────────────────────────
function PollCard({
  poll,
  onPublish,
  onCopyLink,
}: {
  poll: Poll;
  onPublish: (pollId: string) => void;
  onCopyLink: (pollId: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <article className="border-2 border-black bg-white p-8 grid md:grid-cols-[1fr_auto] gap-8">
      <div className={`space-y-4 ${poll.status === "closed" ? "opacity-70" : ""}`}>
        <div className="flex items-center gap-4">
          <StatusBadge status={poll.status} />
          <span className="font-mono text-xs text-gray-500">
            ID: {poll._id.slice(-6).toUpperCase()}
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight">{poll.title}</h3>

        {poll.desc && (
          <p className="text-gray-500 text-sm">{poll.desc}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm text-gray-500">
          <div>
            <p className="text-[10px] uppercase font-bold text-black mb-1">Created</p>
            <p>{new Date(poll.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-black mb-1">Expiry</p>
            <p>{new Date(poll.expiresAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-black mb-1">Mode</p>
            <p>{poll.isAnonymous ? "Anonymous" : "Authenticated"}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-end gap-2 min-w-[140px]">
        {poll.status === "active" && (
          <>
            <button
              onClick={() => navigate(`/analytics/${poll._id}`)}
              className="bg-black text-white px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-mono text-xs font-bold uppercase"
            >
              ANALYTICS
            </button>
            <button
              onClick={() => onCopyLink(poll._id)}
              className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
            >
              <Icon name="share" className="text-sm" />
              SHARE
            </button>
            <button
  onClick={() => navigate(`/polls/${poll._id}/detail`)}
  className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase"
>
  DETAIL
</button>
          </>
        )}

        {poll.status === "closed" && (
          <>
            <button
              onClick={() => onPublish(poll._id)}
              className="bg-black text-white px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
            >
              <Icon name="publish" className="text-sm" />
              PUBLISH
            </button>
            <button
              onClick={() => navigate(`/analytics/${poll._id}`)}
              className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase"
            >
              ANALYTICS
            </button>
            <button
  onClick={() => navigate(`/polls/${poll._id}/detail`)}
  className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase"
>
  DETAIL
</button>
          </>
        )}

        {poll.status === "published" && (
          <>
            <button
              onClick={() => onCopyLink(poll._id)}
              className="bg-black text-white px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-mono text-xs font-bold uppercase"
            >
              VIEW RESULTS
            </button>
            <button
              onClick={() => navigate(`/analytics/${poll._id}`)}
              className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase"
            >
              ANALYTICS
            </button>
            <button
  onClick={() => navigate(`/polls/${poll._id}/detail`)}
  className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono text-xs font-bold uppercase"
>
  DETAIL
</button>
          </>
        )}
      </div>
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-32 border-4 border-black border-dashed bg-gray-50 text-center gap-8">
      <div className="w-32 h-32 bg-black flex items-center justify-center">
        <Icon name="query_stats" className="text-white text-7xl" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold uppercase">No Polls Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Clarity requires data. Start your first inquiry now.
        </p>
      </div>
      <button
        onClick={() => navigate("/poll/create")}
        className="bg-black text-white px-10 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-widest"
      >
        CREATE FIRST POLL
      </button>
    </div>
  );
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

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ Polls fetch karo
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getUserPollsService();
        setPolls(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  // ✅ Toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Publish poll
  const handlePublish = async (pollId: string) => {
    try {
      await publishPollService(pollId);
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? { ...p, status: "published" } : p))
      );
      showToast("POLL PUBLISHED");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Copy share link
  const handleCopyLink = (pollId: string) => {
    const link = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(link);
    showToast("LINK COPIED");
  };

  // ✅ Logout
  const handleLogout = async () => {
    await logoutService();
    navigate("/login");
  };

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const activeCount = polls.filter((p) => p.status === "active").length;
  const totalPolls = polls.length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="bg-[#fbf9f9] text-black min-h-screen flex flex-col">

        {/* ─── Navbar ──────────────────────────────────────────────────────── */}
        <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="ballot" className="text-3xl" />
              <span className="text-2xl font-bold tracking-tight">PollPulse</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase font-bold"
            >
              LOGOUT
            </button>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-16 space-y-16">

          {/* ─── Header ────────────────────────────────────────────────────── */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-8">
            <div className="space-y-1">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                User Dashboard
              </p>
              <h1 className="text-6xl font-extrabold tracking-tighter">
                Welcome, {user?.fullName.split(" ")[0]}.
              </h1>
            </div>
            <button
              onClick={() => navigate("/poll/create")}
              className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
            >
              <Icon name="add_box" />
              CREATE NEW POLL
            </button>
          </header>

          {/* ─── Stats ─────────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black p-8 bg-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs text-gray-500 uppercase">Total Polls</span>
              <span className="text-6xl font-extrabold leading-none">
                {String(totalPolls).padStart(2, "0")}
              </span>
            </div>
            <div className="border-2 border-black p-8 bg-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs text-gray-500 uppercase">Active Polls</span>
              <span className="text-6xl font-extrabold leading-none">
                {String(activeCount).padStart(2, "0")}
              </span>
            </div>
            <div className="border-2 border-black p-8 bg-black text-white flex flex-col justify-between h-36">
              <span className="font-mono text-xs uppercase">System Status</span>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" className="text-white" />
                <span className="text-xl font-bold">Operational</span>
              </div>
            </div>
          </section>

          {/* ─── Poll List ──────────────────────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <h2 className="text-3xl font-bold">Your Polls</h2>
              <span className="font-mono text-xs text-gray-500">
                {totalPolls} TOTAL
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Icon name="sync" className="animate-spin text-4xl" />
              </div>
            ) : polls.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    onPublish={handlePublish}
                    onCopyLink={handleCopyLink}
                  />
                ))}
              </div>
            )}
          </section>

        </main>

   
        <footer className="border-t-2 border-black mt-16">
          <div className="max-w-6xl mx-auto px-8 py-8 flex justify-between items-center">
            <span className="font-bold text-xl">PollPulse</span>
            <p className="text-gray-500 text-sm">© 2026 PollPulse. Clarity in every vote.</p>
          </div>
        </footer>


        {toast && <Toast message={toast} />}

      </div>
    </>
  );
}