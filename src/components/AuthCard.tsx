import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type AuthVariant = "login" | "register";

type AuthCardProps = {
  variant: AuthVariant;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

const variantStyles: Record<
  AuthVariant,
  { header: string; button: string; link: string; ring: string }
> = {
  login: {
    header: "bg-[#3b82f6]",
    button: "bg-[#3b82f6] hover:bg-[#2563eb]",
    link: "text-[#3b82f6]",
    ring: "focus:ring-[#3b82f6]",
  },
  register: {
    header: "bg-[#22c55e]",
    button: "bg-[#22c55e] hover:bg-[#16a34a]",
    link: "text-[#22c55e]",
    ring: "focus:ring-[#22c55e]",
  },
};

export default function AuthCard({
  variant,
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/60 to-violet-100/50 p-4 sm:p-8">
      <div className="w-full max-w-[420px] rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden bg-white">
        <div className={`${styles.header} px-8 py-10 text-center text-white`}>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Image
              src="/favicon.svg"
              alt="Greymoon"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-white/85">{subtitle}</p>
        </div>

        <div className="px-8 py-8">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 px-8 py-4 text-center text-[11px] text-slate-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#3b82f6] ${props.className ?? ""}`}
    />
  );
}

export function AuthButton({
  loading,
  children,
  className = "",
}: {
  loading?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {children}
    </button>
  );
}

export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="relative my-6 text-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <span className="relative bg-white px-3 text-xs text-slate-400">{text}</span>
    </div>
  );
}

export function AuthLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-sm font-semibold hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
