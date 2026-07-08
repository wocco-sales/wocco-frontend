"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveAuth } from "@/lib/auth";
import Logo from "@/components/Logo";

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
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg, #1e3a8a, #1e40af, #1d4ed8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "300px", height: "300px", background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "400px", height: "400px", background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Logo size={120} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: "500", fontSize: "16px", margin: "0 0 4px" }}>World Class Cleaning</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "0 0 48px" }}>Sales Lead Generation Platform</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "320px" }}>
            {[
              { label: "Lead Sources", value: "6+" },
              { label: "US States", value: "50" },
              { label: "Categories", value: "45" },
              { label: "Agents", value: "Active" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "0 0 4px" }}>{s.label}</p>
                <p style={{ color: "white", fontWeight: "800", fontSize: "20px", margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: "480px", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px", flexShrink: 0 }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ color: "white", fontWeight: "700", fontSize: "28px", margin: "0 0 8px" }}>Welcome back</h2>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "8px" }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                placeholder="you@wocco.com"
                required
              />
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "12px 56px 12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? "#1e40af" : "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "4px" }}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #1f2937", textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 8px" }}>
              New agent?{" "}
              <a href="/register" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: "600" }}>Create an account</a>
            </p>
            <p style={{ color: "#374151", fontSize: "11px", margin: 0 }}>WOCCO Sales Lead Platform © 2026 — Confidential</p>
          </div>
        </div>
      </div>
    </div>
  );
}