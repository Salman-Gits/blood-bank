import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Shield, Lock, User, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "../api";

export default function AdminLogin({ setIsAdmin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ username, password });
      if (response && response.success) {
        if (setIsAdmin) setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        setError(response?.message || "Invalid credentials. Please check username and password.");
      }
    } catch (err) {
      setError("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Soft ambient back light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Public Portal
        </button>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/80">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-red-500/30 mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Hospital Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized clinical staff &amp; transfusion management
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-600/20 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Demo Credentials:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-red-400 hover:text-red-300 font-bold underline"
              >
                Auto-Fill (admin / admin123)
              </button>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
              Role: <strong>ADMIN</strong> | Full Access: Donors, Inventory, Requests
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
