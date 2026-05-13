import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.services";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginService(form);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf9f9] text-black min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
        <div className="max-w-7xl mx-auto px-10 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">ballot</span>
            <h1 className="text-2xl font-bold tracking-tight">PollPulse</h1>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-6xl font-extrabold mb-2 tracking-tighter">
              Welcome back.
            </h1>
            <p className="text-lg text-gray-600">
              The truth is waiting. Access your dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 border-2 border-red-500 bg-red-50 text-red-600 text-sm font-mono">
              {error}
            </div>
          )}

          {/* Card */}
          <div className="border-2 border-black bg-white p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="uppercase text-xs tracking-widest font-semibold font-mono">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="border-2 border-black px-4 py-3 focus:outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="uppercase text-xs tracking-widest font-semibold font-mono">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="border-2 border-black px-4 py-3 focus:outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white border-2 border-black py-3 text-lg font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="border-b-2 border-black font-semibold text-black hover:text-gray-500 transition-all">
              Create an account
            </Link>
          </p>

        </div>
      </main>

    </div>
  );
}