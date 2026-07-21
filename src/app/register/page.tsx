"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import AuthCard, {
  AuthButton,
  AuthDivider,
  AuthField,
  AuthInput,
  AuthLink,
} from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard
        variant="register"
        title="Registration Submitted"
        subtitle="Your account is pending admin approval"
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
            ✓
          </div>
          <p className="text-sm leading-6 text-slate-600">
            A Greymoon admin will review your account and activate it shortly. You
            can log in once approved.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-xl bg-[#22c55e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#16a34a]"
          >
            Go to Login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      variant="register"
      title="Create Account"
      subtitle="Join the Greymoon sales platform"
      footer="By creating an account, you agree to our Terms and Privacy Policy"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="First name">
            <AuthInput
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
          </AuthField>
          <AuthField label="Last name">
            <AuthInput
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Smith"
              required
            />
          </AuthField>
        </div>

        <AuthField label="Email address">
          <AuthInput
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </AuthField>

        <AuthField label="Phone number (optional)">
          <AuthInput
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 305 000 0000"
          />
        </AuthField>

        <AuthField label="Password">
          <div className="relative">
            <AuthInput
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
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
          <p className="mt-1 text-xs text-slate-400">Must be at least 8 characters</p>
        </AuthField>

        <AuthField label="Confirm password">
          <AuthInput
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            required
          />
        </AuthField>

        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#22c55e] focus:ring-[#22c55e]"
          />
          <span>
            I agree to the{" "}
            <span className="font-medium text-[#22c55e]">Terms of Service</span>{" "}
            and <span className="font-medium text-[#22c55e]">Privacy Policy</span>
          </span>
        </label>

        <AuthButton
          loading={loading}
          className="bg-[#22c55e] hover:bg-[#16a34a]"
        >
          {loading ? "Creating account..." : "Create Account →"}
        </AuthButton>
      </form>

      <AuthDivider text="Already have an account?" />

      <div className="text-center">
        <AuthLink href="/login" className="text-[#22c55e]">
          Sign in instead →
        </AuthLink>
      </div>
    </AuthCard>
  );
}
