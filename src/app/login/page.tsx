"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      saveAuth(data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-gray-950 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tight">WOCCO</h1>
          <p className="text-blue-300 text-lg font-medium mb-2">World Class Cleaning</p>
          <p className="text-blue-400 text-sm">Sales Lead Generation Platform</p>
          <div className="mt-16 grid grid-cols-2 gap-4 text-left">
            {[
              { label: "Lead Sources", value: "6+" },
              { label: "US States", value: "50" },
              { label: "Categories", value: "45" },
              { label: "Agents", value: "Active" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-blue-300 text-xs mb-1">{s.label}</p>
                <p className="text-white font-bold text-xl">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-black text-blue-400">WOCCO</h1>
            <p className="text-gray-500 text-sm mt-1">Sales Lead Platform</p>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <span>&#9888;</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                placeholder="you@wocco.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3.5 pr-14 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-8">
            WOCCO Sales Lead Platform &copy; 2026 &mdash; Confidential
          </p>
        </div>
      </div>
    </div>
  );
}
