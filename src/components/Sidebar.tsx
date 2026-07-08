"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import Logo from "@/components/Logo";

const BASE_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Heat Map", href: "/dashboard/map" },
];

const ADMIN_LINKS = [
  { label: "Agents", href: "/dashboard/agents" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Scraper", href: "/dashboard/scrape" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const links = isAdmin ? [...BASE_LINKS, ...ADMIN_LINKS] : BASE_LINKS;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside style={{ width: "240px", background: "#111827", borderRight: "1px solid #1f2937", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f2937" }}>
        <Logo size={36} showText subtitle="Sales Lead Platform" />
      </div>

      <nav style={{ flex: 1, padding: "16px" }}>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: "8px",
              color: isActive(item.href) ? "#fff" : "#9ca3af",
              textDecoration: "none",
              fontSize: "13px",
              marginBottom: "2px",
              background: isActive(item.href) ? "#1f2937" : "transparent",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: "16px", borderTop: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#1f2937", borderRadius: "10px", marginBottom: "8px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: "bold", flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontSize: "12px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: 0, textTransform: "capitalize" }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "8px", padding: "9px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
