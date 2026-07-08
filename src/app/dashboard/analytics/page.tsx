"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ total: 0, newToday: 0, called: 0, closedWon: 0, interested: 0, byStatus: [], bySource: [], byState: [] });
  const [agents, setAgents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (u && u.role !== "admin" && u.role !== "super_admin") { router.push("/dashboard"); return; }
    Promise.all([
      api.get("/leads/stats"),
      api.get("/users"),
      api.get("/leads/leaderboard"),
    ]).then(([statsRes, agentsRes, leaderboardRes]) => {
      setStats(statsRes.data);
      setAgents(agentsRes.data.filter((a: any) => a.role === "agent"));
      setLeaderboard(leaderboardRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const conversionRate = stats.total > 0 ? ((stats.closedWon / stats.total) * 100).toFixed(1) : "0.0";
  const contactRate = stats.total > 0 ? ((stats.called / stats.total) * 100).toFixed(1) : "0.0";
  const interestRate = stats.called > 0 ? ((stats.interested / stats.called) * 100).toFixed(1) : "0.0";

  const statusOrder = ["new","called","interested","not_interested","no_answer","callback","closed_won","disqualified"];
  const statusLabels: any = {
    new: "New", called: "Called", interested: "Interested",
    not_interested: "Not Interested", no_answer: "No Answer",
    callback: "Callback", closed_won: "Closed Won", disqualified: "Disqualified"
  };
  const statusColors: any = {
    new: "#60a5fa", called: "#fbbf24", interested: "#34d399",
    not_interested: "#ef4444", no_answer: "#9ca3af",
    callback: "#a855f7", closed_won: "#10b981", disqualified: "#6b7280"
  };

  const maxStatus = Math.max(...stats.byStatus.map((s: any) => parseInt(s.count)), 1);
  const maxSource = Math.max(...stats.bySource.map((s: any) => parseInt(s.count)), 1);

  return (
    <>
      <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Analytics</h2>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>Lead pipeline performance overview</p>
          </div>
          <button onClick={() => { setLoading(true); Promise.all([api.get("/leads/stats"), api.get("/leads/leaderboard")]).then(([s, l]) => { setStats(s.data); setLeaderboard(l.data); }).finally(() => setLoading(false)); }} style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}>Refresh</button>
        </header>

        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading analytics...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
                {[
                  { label: "Total Leads", value: stats.total, color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
                  { label: "Conversion Rate", value: conversionRate + "%", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
                  { label: "Contact Rate", value: contactRate + "%", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
                  { label: "Interest Rate", value: interestRate + "%", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#111827", border: "1px solid " + s.border, borderRadius: "16px", padding: "20px" }}>
                    <span style={{ background: s.bg, color: s.color, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "12px" }}>{s.label}</span>
                    <p style={{ color: s.color, fontSize: "30px", fontWeight: "900", margin: "0 0 2px" }}>{s.value}</p>
                    <p style={{ color: "#4b5563", fontSize: "11px", margin: 0 }}>
                      {s.label === "Conversion Rate" ? "Closed won / total leads" :
                       s.label === "Contact Rate" ? "Called / total leads" :
                       s.label === "Interest Rate" ? "Interested / called" : "In database"}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>Agent Leaderboard</h3>
                  <span style={{ color: "#4b5563", fontSize: "11px" }}>Ranked by leads closed, then conversion rate</span>
                </div>
                {leaderboard.length === 0 ? (
                  <p style={{ color: "#4b5563", fontSize: "13px", margin: 0 }}>No agent activity yet — leaderboard fills in once leads are assigned and worked</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 110px 110px 110px 140px", gap: "8px", padding: "0 12px 10px", borderBottom: "1px solid #1f2937" }}>
                      {["#", "Agent", "Assigned", "Calls Made", "Closed", "Conversion"].map((h, i) => (
                        <span key={h} style={{ color: "#6b7280", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", textAlign: i >= 2 ? "right" : "left" }}>{h}</span>
                      ))}
                    </div>
                    {leaderboard.map((a: any, i: number) => {
                      const rankColors = ["#fbbf24", "#9ca3af", "#b45309"];
                      const rankColor = rankColors[i] || "#4b5563";
                      const maxConv = Math.max(...leaderboard.map((x: any) => x.conversionRate), 1);
                      return (
                        <div key={a.agentId} style={{ display: "grid", gridTemplateColumns: "44px 1fr 110px 110px 110px 140px", gap: "8px", alignItems: "center", padding: "12px", borderBottom: "1px solid #161e2e", background: i === 0 ? "rgba(251,191,36,0.04)" : "transparent", borderRadius: i === 0 ? "10px" : 0 }}>
                          <span style={{ color: rankColor, fontSize: "13px", fontWeight: "800" }}>{i + 1}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: i === 0 ? "rgba(251,191,36,0.15)" : "#374151", color: i === 0 ? "#fbbf24" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", flexShrink: 0 }}>
                              {a.firstName?.[0]}{a.lastName?.[0]}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ color: "white", fontSize: "12px", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.firstName} {a.lastName}</p>
                              <p style={{ color: "#6b7280", fontSize: "10px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.email}</p>
                            </div>
                          </div>
                          <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600", textAlign: "right" }}>{a.assigned}</span>
                          <span style={{ color: "#fbbf24", fontSize: "12px", fontWeight: "700", textAlign: "right" }}>{a.callsMade}</span>
                          <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "700", textAlign: "right" }}>{a.closedWon}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                            <div style={{ width: "60px", height: "5px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: (a.conversionRate / maxConv * 100) + "%", background: "#34d399", borderRadius: "3px" }} />
                            </div>
                            <span style={{ color: "#34d399", fontSize: "12px", fontWeight: "700", width: "44px", textAlign: "right" }}>{a.conversionRate}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 20px" }}>Lead Pipeline — Status Breakdown</h3>
                  {stats.byStatus.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "13px" }}>No data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {statusOrder.map(status => {
                        const found = stats.byStatus.find((s: any) => s.status === status);
                        const count = found ? parseInt(found.count) : 0;
                        const pct = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : "0";
                        return (
                          <div key={status}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{statusLabels[status]}</span>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{ color: statusColors[status], fontSize: "12px", fontWeight: "700" }}>{count}</span>
                                <span style={{ color: "#4b5563", fontSize: "11px" }}>{pct}%</span>
                              </div>
                            </div>
                            <div style={{ height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: (count / maxStatus * 100) + "%", background: statusColors[status], borderRadius: "3px", transition: "width 0.5s" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 20px" }}>Lead Sources</h3>
                  {stats.bySource.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "13px" }}>No data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {stats.bySource.map((s: any) => {
                        const count = parseInt(s.count);
                        const pct = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : "0";
                        const colors: any = { google: "#34d399", craigslist: "#f97316", facebook: "#60a5fa", csv_import: "#a78bfa", manual: "#fbbf24" };
                        const color = colors[s.source] || "#9ca3af";
                        return (
                          <div key={s.source}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>{s.source?.replace(/_/g," ")}</span>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{ color, fontSize: "12px", fontWeight: "700" }}>{count}</span>
                                <span style={{ color: "#4b5563", fontSize: "11px" }}>{pct}%</span>
                              </div>
                            </div>
                            <div style={{ height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: (count / maxSource * 100) + "%", background: color, borderRadius: "3px" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 20px" }}>Geographic Distribution — Top 10 States</h3>
                  {stats.byState.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "13px" }}>No state data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {stats.byState.map((s: any, i: number) => {
                        const count = parseInt(s.count);
                        const maxStateCount = parseInt(stats.byState[0]?.count || 1);
                        return (
                          <div key={s.state} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: "#4b5563", fontSize: "11px", width: "20px", textAlign: "right", flexShrink: 0 }}>#{i+1}</span>
                            <span style={{ color: "#9ca3af", fontSize: "12px", width: "30px", flexShrink: 0, fontWeight: "600" }}>{s.state}</span>
                            <div style={{ flex: 1, height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: (count / maxStateCount * 100) + "%", background: "#2563eb", borderRadius: "3px" }} />
                            </div>
                            <span style={{ color: "#60a5fa", fontSize: "12px", fontWeight: "700", width: "30px", textAlign: "right", flexShrink: 0 }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 20px" }}>Agent Roster</h3>
                  {agents.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                      <p style={{ color: "#4b5563", fontSize: "13px", margin: "0 0 4px" }}>No agents yet</p>
                      <p style={{ color: "#374151", fontSize: "11px", margin: "0 0 16px" }}>Agents will appear here once registered and approved</p>
                      <a href="/dashboard/agents" style={{ background: "#2563eb", color: "white", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Manage Agents</a>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {agents.map((agent: any) => (
                        <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#1f2937", borderRadius: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: "bold", flexShrink: 0 }}>
                            {agent.firstName?.[0]}{agent.lastName?.[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "white", fontSize: "12px", fontWeight: "500", margin: 0 }}>{agent.firstName} {agent.lastName}</p>
                            <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{agent.email}</p>
                          </div>
                          <span style={{ background: agent.status === "active" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)", color: agent.status === "active" ? "#34d399" : "#fbbf24", fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>
                            {agent.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg,#1e3a5f,#111827)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 16px" }}>Pipeline Summary</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px" }}>
                  {[
                    { label: "Total", value: stats.total, color: "#e5e7eb" },
                    { label: "New", value: stats.byStatus.find((s:any)=>s.status==="new")?.count || 0, color: "#60a5fa" },
                    { label: "Called", value: stats.called, color: "#fbbf24" },
                    { label: "Interested", value: stats.interested, color: "#34d399" },
                    { label: "Closed Won", value: stats.closedWon, color: "#10b981" },
                    { label: "Disqualified", value: stats.byStatus.find((s:any)=>s.status==="disqualified")?.count || 0, color: "#6b7280" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <p style={{ color: s.color, fontSize: "24px", fontWeight: "900", margin: "0 0 4px" }}>{s.value}</p>
                      <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </main>
    </>
  );
}

