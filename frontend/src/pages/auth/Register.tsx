import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerService } from "../../services/auth.services";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerService(form);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-black flex flex-col">

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
        <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Left Brand Column */}
          <div className="hidden md:flex md:col-span-7 flex-col justify-center space-y-8">
            <h1 className="text-[64px] font-extrabold text-black leading-none tracking-tighter">
              DATA IS THE<br />NEW TRUTH.
            </h1>
            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Join the authoritative platform for transparent data collection.
              We strip away the fluff to prioritize the user's voice and digital precision.
            </p>
            <div className="inline-block border-2 border-black p-8 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined">verified</span>
                <span className="font-mono text-xs tracking-widest uppercase">Verified Protocol</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200">
                  <div className="h-full bg-black w-3/4" />
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span>POLLING ACCURACY</span>
                  <span>99.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="border-4 border-black bg-white p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-1">Create Account</h2>
                <p className="text-base text-gray-500">Enter your credentials to access the pulse.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 border-2 border-red-500 bg-red-50 text-red-600 text-sm font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex flex-col gap-1">
                  <label htmlFor="fullName" className="font-mono text-xs tracking-widest uppercase">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="w-full p-4 border-2 border-black text-base bg-white placeholder:text-gray-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-mono text-xs tracking-widest uppercase">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full p-4 border-2 border-black text-base bg-white placeholder:text-gray-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="font-mono text-xs tracking-widest uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="w-full p-4 border-2 border-black text-base bg-white placeholder:text-gray-400 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white text-xl font-bold py-4 px-8 border-2 border-black hover:bg-white hover:text-black transition-colors uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>

              </form>
            </div>

            <p className="mt-4 text-center text-base text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-black border-b-2 border-black hover:text-gray-500 transition-all">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}