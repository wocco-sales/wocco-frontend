"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>
            ✓
          </div>
          <h2 style={{ color: "white", fontWeight: "700", fontSize: "22px", margin: "0 0 10px" }}>Registration Submitted</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 8px", lineHeight: "1.6" }}>
            Your account has been created and is <strong style={{ color: "#fbbf24" }}>pending admin approval</strong>.
          </p>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 28px", lineHeight: "1.6" }}>
            WOCCO admin will review your account and activate it shortly. You will be able to log in once approved.
          </p>
          <button onClick={() => router.push("/login")} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div style={{ display: "none", width: "45%" }} className="lg-flex" />
      <div style={{ flex: 1, background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ color: "#60a5fa", fontWeight: "900", fontSize: "36px", margin: "0 0 6px" }}>WOCCO</h1>
            <p style={{ color: "#4b5563", fontSize: "13px", margin: 0 }}>Sales Lead Platform</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ color: "white", fontWeight: "700", fontSize: "24px", margin: "0 0 6px" }}>Create your account</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Register as a sales agent — admin approval required before login</p>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Smith" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>Phone Number <span style={{ color: "#4b5563" }}>(optional)</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 305 000 0000" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="Min. 8 characters" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 50px 10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>Confirm Password</label>
              <input name="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat your password" style={{ width: "100%", background: "#111827", border: "1px solid #1f2937", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "10px", padding: "12px 14px", marginTop: "4px" }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0, lineHeight: "1.5" }}>
                By registering, your account will be <span style={{ color: "#fbbf24" }}>pending approval</span>. A WOCCO admin will activate your account before you can log in.
              </p>
            </div>

            <button type="submit" disabled={loading} style={{ background: loading ? "#1e40af" : "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "13px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "4px" }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: "500" }}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}