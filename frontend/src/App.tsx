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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
        <span className="material-symbols-outlined animate-spin text-4xl">
          sync
        </span>
      </div>
    );
  }

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