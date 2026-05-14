import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/auth.store";
import { getCurrentUserService } from "./services/auth.services";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import PollPage from "./pages/PollPage";
import Analytics from "./pages/Analytics";
import PollDetail from "./pages/PollDetail";
import LandingPage from "./pages/landingPage";

  function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#fbf9f9]">
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" fill="#000" />
          <rect x="6" y="16" width="4" height="7" fill="white" />
          <rect x="12" y="10" width="4" height="13" fill="white" />
          <rect x="18" y="5" width="4" height="18" fill="white" />
        </svg>
        <span className="font-['Hanken_Grotesk'] text-2xl font-black tracking-tighter">
          PollPulse
        </span>
      </div>

      {/* Animated Bars */}
      <div className="flex items-end gap-1.5 h-9">
        {[16, 28, 36, 22, 12].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-black"
            style={{
              height: h,
              animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="font-mono text-xs tracking-[0.15em] uppercase text-gray-400">
        Loading...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: scaleY(0.6); }
          50%       { opacity: 1;   transform: scaleY(1);   }
        }
      `}</style>
    </div>
  );
}


export default function App() {



  const [loading, setLoading] = useState(true);

useEffect(() => {
  const initAuth = async () => {
    try {
      await getCurrentUserService();

    } catch (error: unknown) {

      useAuthStore.getState().setUser(null);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>

     <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

     <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
   
   <Route path="/poll/create" element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        } />
     
        <Route path="/poll/:pollId" element={<PollPage />} />

  
  <Route path="/polls/:pollId/detail" element={
  <ProtectedRoute>
    <PollDetail />
  </ProtectedRoute>
} />
     

        <Route path="/analytics/:pollId" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />

  
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}