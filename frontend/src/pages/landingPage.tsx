import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}



// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "CREATE POLLS",
    "SHARE LINKS",
    "COLLECT RESPONSES",
    "VIEW ANALYTICS",
    "PUBLISH RESULTS",
    "REAL-TIME UPDATES",
  ];

  return (
    <div className="overflow-hidden border-y-2 border-black bg-black py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 font-mono text-sm text-white uppercase tracking-widest flex items-center gap-4"
          >
            {item}
            <span className="text-gray-500">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <div
      className="border-2 border-black bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-default"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 border-2 border-black group-hover:border-white flex items-center justify-center mb-6 transition-colors">
        <Icon name={icon} className="text-2xl group-hover:text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-mono uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors">
        {desc}
      </p>
    </div>
  );
}

// ─── How It Works Step ────────────────────────────────────────────────────────
function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-mono text-xl font-bold flex-shrink-0">
        {number}
      </div>
      <div className="pt-1">
        <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.7s ease forwards;
        }
        .fade-up-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-delay-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-delay-4 { animation-delay: 0.4s; opacity: 0; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink { animation: blink 1s step-end infinite; }
        .grid-bg {
          background-image: linear-gradient(#00000008 1px, transparent 1px),
            linear-gradient(90deg, #00000008 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="bg-[#fbf9f9] text-black min-h-screen font-['Hanken_Grotesk'] overflow-x-hidden">

        {/* ─── Navbar ────────────────────────────────────────────────────────── */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled
              ? "bg-white border-b-2 border-black"
              : "bg-transparent border-b-2 border-transparent"
          }`}
        >
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="ballot" className="text-3xl" />
              <span className="text-2xl font-black tracking-tighter">PollPulse</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                How it works
              </a>
              <a
                href="#stats"
                className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Stats
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="font-mono text-xs uppercase tracking-widest px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors font-bold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-20 grid-bg">

          {/* Decorative Elements */}
          <div className="absolute top-32 right-8 md:right-32 w-48 h-48 border-2 border-black opacity-10 rotate-12" />
          <div className="absolute bottom-32 left-8 md:left-32 w-24 h-24 bg-black opacity-5" />

          <div className="max-w-6xl mx-auto px-8 w-full py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

              {/* Left — Text */}
              <div className="md:col-span-7 space-y-8">
                <div className="fade-up fade-up-delay-1">
                  <span className="font-mono text-xs uppercase tracking-widest border-2 border-black px-3 py-1 inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Now Live — Hackathon Edition
                  </span>
                </div>

                <h1 className="fade-up fade-up-delay-2 text-[72px] md:text-[96px] font-black leading-none tracking-tighter">
                  POLLS
                  <br />
                  <span className="text-stroke">THAT</span>
                  <br />
                  SPEAK.
                </h1>

                <p className="fade-up fade-up-delay-3 text-lg text-gray-500 max-w-lg leading-relaxed font-['JetBrains_Mono'] text-sm">
                  Create. Share. Analyze. — The authoritative platform for
                  real-time data collection with zero fluff and maximum clarity.
                </p>

                <div className="fade-up fade-up-delay-4 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/signup"
                    className="bg-black text-white px-10 py-4 border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 group"
                  >
                    Start For Free
                    <Icon
                      name="arrow_forward"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="px-10 py-4 border-2 border-black hover:bg-black hover:text-white transition-all font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2"
                  >
                    See How It Works
                  </a>
                </div>
              </div>

              {/* Right — Live Mock Card */}
              <div className="md:col-span-5 fade-up fade-up-delay-3">
                <div className="border-4 border-black bg-white p-6 relative">
                  {/* Mock Poll Card */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs border border-black px-2 py-1 uppercase flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Poll
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        42 responses
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight">
                      Best frontend framework?
                    </h3>

                    {/* Options */}
                    {[
                      { label: "React", pct: 68 },
                      { label: "Vue", pct: 18 },
                      { label: "Angular", pct: 9 },
                      { label: "Svelte", pct: 5 },
                    ].map((opt, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between font-mono text-xs">
                          <span className={i === 0 ? "font-bold" : "text-gray-500"}>
                            {opt.label}
                          </span>
                          <span>{opt.pct}%</span>
                        </div>
                        <div className="h-6 w-full bg-gray-100 border border-gray-200">
                          <div
                            className={`h-full transition-all duration-1000 ${i === 0 ? "bg-black" : "bg-gray-300"}`}
                            style={{ width: `${opt.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-mono text-xs text-gray-400">
                      <span>Expires in 2 days</span>
                      <span className="flex items-center gap-1">
                        <Icon name="share" className="text-sm" />
                        Share
                      </span>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 font-mono text-xs uppercase flex items-center gap-1">
                    <span className="blink">●</span>
                    Real-time
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Marquee ───────────────────────────────────────────────────────── */}
        <Marquee />



        {/* ─── Features ──────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 border-b-2 border-black">
          <div className="max-w-6xl mx-auto px-8 space-y-16">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                Why PollPulse
              </p>
              <h2 className="text-5xl font-black tracking-tighter">
                EVERYTHING YOU NEED.
                <br />
                <span className="text-gray-300">NOTHING YOU DON'T.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "add_box",
                  title: "Easy Poll Creation",
                  desc: "Create polls with multiple single-choice questions. Mark questions as required or optional with a simple toggle.",
                },
                {
                  icon: "share",
                  title: "Instant Sharing",
                  desc: "Get a public link instantly. Share with anyone — no account needed to respond to anonymous polls.",
                },
                {
                  icon: "people",
                  title: "Flexible Responses",
                  desc: "Support both anonymous and authenticated response modes. IP-based spam prevention for anonymous polls.",
                },
                {
                  icon: "timer",
                  title: "Auto Expiry",
                  desc: "Set expiry dates for polls. They automatically close when time is up — no manual work needed.",
                },
                {
                  icon: "analytics",
                  title: "Rich Analytics",
                  desc: "View total responses, per-question breakdowns, option counts, and participation insights in one dashboard.",
                },
                {
                  icon: "bolt",
                  title: "Real-Time Updates",
                  desc: "WebSocket-powered live updates. Watch response counts and analytics update instantly as people respond.",
                },
              ].map((f, i) => (
                <FeatureCard key={i} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ──────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 border-b-2 border-black bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">

              {/* Left */}
              <div className="md:col-span-5 space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  How It Works
                </p>
                <h2 className="text-5xl font-black tracking-tighter">
                  FOUR STEPS
                  <br />
                  TO CLARITY.
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-mono">
                  From poll creation to published results — the entire flow
                  in minutes, not hours.
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wide mt-4"
                >
                  Get Started
                  <Icon name="arrow_forward" />
                </Link>
              </div>

              {/* Right */}
              <div className="md:col-span-7 space-y-8">
                {[
                  {
                    number: "01",
                    title: "Create Your Poll",
                    desc: "Sign up, create a poll with a title, description, expiry date, and choose between anonymous or authenticated mode.",
                  },
                  {
                    number: "02",
                    title: "Add Questions",
                    desc: "Add single-choice questions with up to 10 options each. Mark questions as required or optional.",
                  },
                  {
                    number: "03",
                    title: "Share The Link",
                    desc: "Copy the public link and share it anywhere — email, Slack, WhatsApp, or social media.",
                  },
                  {
                    number: "04",
                    title: "Analyze & Publish",
                    desc: "View real-time analytics as responses come in. Publish results when ready — the same link shows public results.",
                  },
                ].map((step, i) => (
                  <Step key={i} {...step} />
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ─── Poll Status Flow ───────────────────────────────────────────────── */}
        <section className="py-24 border-b-2 border-black">
          <div className="max-w-6xl mx-auto px-8 space-y-12">
            <div className="text-center space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                Poll Lifecycle
              </p>
              <h2 className="text-4xl font-black tracking-tighter">
                ONE LINK. THREE STATES.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
              {[
                {
                  status: "ACTIVE",
                  icon: "edit_note",
                  desc: "Respondents see the form and can submit their answers.",
                  bg: "bg-white",
                  badge: "border-black text-black",
                },
                {
                  status: "CLOSED",
                  icon: "lock",
                  desc: "Poll has expired. No new responses accepted.",
                  bg: "bg-gray-50",
                  badge: "border-gray-400 text-gray-500",
                },
                {
                  status: "PUBLISHED",
                  icon: "bar_chart",
                  desc: "Results are public. Everyone sees the final breakdown.",
                  bg: "bg-black text-white",
                  badge: "border-white text-white",
                },
              ].map((state, i) => (
                <div
                  key={i}
                  className={`p-10 space-y-4 ${state.bg} ${i < 2 ? "border-r-2 border-black" : ""}`}
                >
                  <span
                    className={`font-mono text-xs px-3 py-1 border-2 uppercase ${state.badge}`}
                  >
                    {state.status}
                  </span>
                  <div className="w-12 h-12 border-2 border-current flex items-center justify-center">
                    <Icon name={state.icon} className="text-2xl" />
                  </div>
                  <p className={`text-sm leading-relaxed font-mono ${i === 2 ? "text-gray-300" : "text-gray-500"}`}>
                    {state.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-32 bg-black text-white">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Ready to start?
            </p>
            <h2 className="text-[72px] font-black tracking-tighter leading-none">
              COLLECT THE
              <br />
              TRUTH.
            </h2>
            <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto leading-relaxed">
              Join thousands of creators who use PollPulse to make
              data-driven decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-black px-12 py-4 border-2 border-white hover:bg-black hover:text-white transition-all font-bold uppercase tracking-wide text-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-12 py-4 border-2 border-gray-600 hover:border-white transition-all font-bold uppercase tracking-wide text-lg text-gray-400 hover:text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Footer ────────────────────────────────────────────────────────── */}
        <footer className="border-t-2 border-black bg-[#fbf9f9]">
          <div className="max-w-6xl mx-auto px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="ballot" className="text-3xl" />
                  <span className="text-2xl font-black tracking-tighter">PollPulse</span>
                </div>
                <p className="font-mono text-xs text-gray-400 max-w-xs">
                  The authoritative platform for transparent data collection.
                  Clarity in every vote.
                </p>
              </div>

              <div className="flex gap-16">
                <div className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-widest font-bold">Product</p>
                  {["Features", "How It Works", "Pricing"].map((item) => (
                    <p key={item}>
                      <a href="#" className="font-mono text-xs text-gray-500 hover:text-black transition-colors">
                        {item}
                      </a>
                    </p>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-widest font-bold">Legal</p>
                  {["Privacy", "Terms", "Contact"].map((item) => (
                    <p key={item}>
                      <a href="#" className="font-mono text-xs text-gray-500 hover:text-black transition-colors">
                        {item}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-mono text-xs text-gray-400">
                © 2026 PollPulse. All rights reserved.
              </p>
           
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}