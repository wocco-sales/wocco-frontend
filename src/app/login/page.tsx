"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import AuthCard, {
  AuthButton,
  AuthDivider,
  AuthField,
  AuthInput,
  AuthLink,
} from "@/components/AuthCard";

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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      variant="login"
      title="Welcome Back"
      subtitle="Sign in to your Greymoon account"
      footer="By signing in, you agree to our Terms of Service and Privacy Policy"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField label="Email address">
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </AuthField>

        <AuthField label="Password">
          <div className="relative">
            <AuthInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </AuthField>

        <AuthButton
          loading={loading}
          className="bg-[#3b82f6] hover:bg-[#2563eb]"
        >
          {loading ? "Signing in..." : "Sign In →"}
        </AuthButton>
      </form>

      <AuthDivider text="New to our platform?" />

      <div className="text-center">
        <AuthLink href="/register" className="text-[#3b82f6]">
          Create an account →
        </AuthLink>
      </div>
    </AuthCard>
  );
}
