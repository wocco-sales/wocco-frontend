"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ total: 0, newToday: 0, called: 0, closedWon: 0, interested: 0, byStatus: [], bySource: [], byState: [] });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setUser(getUser());
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoadingStats(true);
      const res = await api.get("/leads/stats");
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <>
      <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Dashboard</h2>
                <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>Overview of your lead pipeline</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => router.push("/dashboard/leads/import")} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>+ Import Leads</button>
                <button onClick={fetchStats} style={{ background: "#1f2937", color: "white", border: "1px solid #374151", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Refresh</button>
              </div>
            </header>

            <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Total Leads", value: stats.total, sub: "In database", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
                  { label: "New Today", value: stats.newToday, sub: "Added today", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
                  { label: "Called", value: stats.called, sub: "Contacted", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
                  { label: "Closed Won", value: stats.closedWon, sub: "Converted", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#111827", border: "1px solid " + s.border, borderRadius: "16px", padding: "20px" }}>
                    <span style={{ background: s.bg, color: s.color, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "12px" }}>{s.label}</span>
                    <p style={{ color: s.color, fontSize: "32px", fontWeight: "900", margin: "0 0 2px" }}>{loadingStats ? "..." : s.value}</p>
                    <p style={{ color: "#4b5563", fontSize: "11px", margin: 0 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 14px" }}>Leads by Status</h3>
                  {loadingStats ? (
                    <p style={{ color: "#6b7280", fontSize: "12px" }}>Loading...</p>
                  ) : stats.byStatus.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "12px" }}>No data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {stats.byStatus.map((s: any) => (
                        <div key={s.status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#9ca3af", fontSize: "12px", textTransform: "capitalize" }}>{s.status?.replace(/_/g, " ")}</span>
                          <span style={{ color: "white", fontSize: "12px", fontWeight: "700", background: "#1f2937", padding: "2px 8px", borderRadius: "4px" }}>{s.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 14px" }}>Leads by Source</h3>
                  {loadingStats ? (
                    <p style={{ color: "#6b7280", fontSize: "12px" }}>Loading...</p>
                  ) : stats.bySource.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "12px" }}>No data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {stats.bySource.map((s: any) => (
                        <div key={s.source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>{s.source?.replace(/_/g, " ")}</span>
                          <span style={{ color: "white", fontSize: "12px", fontWeight: "700", background: "#1f2937", padding: "2px 8px", borderRadius: "4px" }}>{s.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 14px" }}>Top States</h3>
                  {loadingStats ? (
                    <p style={{ color: "#6b7280", fontSize: "12px" }}>Loading...</p>
                  ) : stats.byState.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "12px" }}>No data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {stats.byState.map((s: any) => (
                        <div key={s.state} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#9ca3af", fontSize: "12px" }}>{s.state}</span>
                          <span style={{ color: "white", fontSize: "12px", fontWeight: "700", background: "#1f2937", padding: "2px 8px", borderRadius: "4px" }}>{s.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: 0 }}>Recent Leads</h3>
                    <a href="/dashboard/leads" style={{ color: "#60a5fa", fontSize: "12px", textDecoration: "none" }}>View all {stats.total} leads</a>
                  </div>
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <p style={{ color: "#4b5563", fontSize: "13px", margin: "0 0 4px" }}>{stats.total === 0 ? "No leads yet" : stats.total + " leads in pipeline"}</p>
                    <p style={{ color: "#374151", fontSize: "11px", margin: "0 0 16px" }}>{stats.total === 0 ? "Import leads or run a scrape to get started" : "Click View all to manage your leads"}</p>
                    <a href="/dashboard/leads" style={{ background: "#2563eb", color: "white", borderRadius: "8px", padding: "8px 20px", fontSize: "12px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>
                      {stats.total === 0 ? "Import Leads" : "View Leads"}
                    </a>
                  </div>
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 16px" }}>Quick Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Import CSV", desc: "Upload lead list", color: "#60a5fa", href: "/dashboard/leads/import" },
                      { label: "View All Leads", desc: stats.total + " total", color: "#34d399", href: "/dashboard/leads" },
                      { label: "View Heat Map", desc: "Lead density", color: "#a78bfa", href: "/dashboard/map" },
                      { label: "Manage Agents", desc: "Approve accounts", color: "#fbbf24", href: "/dashboard/agents" },
                    ].map((a) => (
                      <a key={a.label} href={a.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", cursor: "pointer", textDecoration: "none" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: a.color, flexShrink: 0 }}></div>
                        <div>
                          <p style={{ color: "white", fontSize: "12px", fontWeight: "500", margin: 0 }}>{a.label}</p>
                          <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{a.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "16px", background: "linear-gradient(135deg,#1e3a5f,#111827)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 6px" }}>Welcome back, {user?.firstName}</h3>
                <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
                  {stats.total === 0
                    ? "Your platform is ready. Start by importing your first leads or setting up Apify scraping."
                    : "You have " + stats.total + " leads in the pipeline. " + stats.newToday + " added today. " + stats.interested + " leads are currently interested."}
                </p>
              </div>
            </main>
    </>
  );
}