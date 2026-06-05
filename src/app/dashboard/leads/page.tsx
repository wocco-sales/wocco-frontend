"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";
import api from "@/lib/api";

export default function LeadsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    setUser(getUser());
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      const res = await api.get("/leads", { params });
      setLeads(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeads(); }, [statusFilter, sourceFilter]);

  const filtered = leads.filter((l) =>
    search === "" ||
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    l.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search) ||
    l.state?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: any = {
    new: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa" },
    called: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    interested: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
    not_interested: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    no_answer: { bg: "rgba(156,163,175,0.15)", color: "#9ca3af" },
    callback: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },
    closed_won: { bg: "rgba(52,211,153,0.2)", color: "#10b981" },
    disqualified: { bg: "rgba(239,68,68,0.1)", color: "#6b7280" },
  };

  const tempColors: any = {
    hot: "#ef4444",
    warm: "#f97316",
    cold: "#60a5fa",
  };

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch("/leads/" + id + "/status", { status });
      fetchLeads();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ background: "#030712", minHeight: "100vh", display: "flex" }}>
      <aside style={{ width: "240px", background: "#111827", borderRight: "1px solid #1f2937", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1f2937" }}>
          <h1 style={{ color: "#60a5fa", fontWeight: "900", fontSize: "24px", margin: 0 }}>WOCCO</h1>
          <p style={{ color: "#4b5563", fontSize: "11px", margin: "2px 0 0" }}>Sales Lead Platform</p>
        </div>
        <nav style={{ flex: 1, padding: "16px" }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leads", href: "/dashboard/leads" },
            { label: "Heat Map", href: "/dashboard/map" },
            ...((user?.role === "admin" || user?.role === "super_admin") ? [
              { label: "Agents", href: "/dashboard/agents" },
              { label: "Analytics", href: "/dashboard/analytics" },
            ] : []),
          ].map((item) => (
            <a key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: "8px", color: item.href === "/dashboard/leads" ? "#fff" : "#9ca3af", textDecoration: "none", fontSize: "13px", marginBottom: "2px", background: item.href === "/dashboard/leads" ? "#1f2937" : "transparent" }}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Leads</h2>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>{leads.length} total leads in database</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => router.push("/dashboard/leads/import")} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>+ Import CSV</button>
          </div>
        </header>

        <div style={{ padding: "16px 24px", background: "#0f172a", borderBottom: "1px solid #1f2937", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, state..."
            style={{ flex: 1, minWidth: "200px", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", outline: "none" }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", outline: "none" }}>
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="called">Called</option>
            <option value="interested">Interested</option>
            <option value="not_interested">Not Interested</option>
            <option value="no_answer">No Answer</option>
            <option value="callback">Callback</option>
            <option value="closed_won">Closed Won</option>
            <option value="disqualified">Disqualified</option>
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", outline: "none" }}>
            <option value="">All Sources</option>
            <option value="google">Google</option>
            <option value="craigslist">Craigslist</option>
            <option value="facebook">Facebook</option>
            <option value="csv_import">CSV Import</option>
            <option value="manual">Manual</option>
          </select>
          <button onClick={fetchLeads} style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}>Refresh</button>
        </div>

        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading leads...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 6px" }}>No leads found</p>
              <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>Import a CSV or run a scrape to add leads</p>
            </div>
          ) : (
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f2937" }}>
                    {["Name", "Phone", "Email", "Location", "Category", "Source", "Temp", "Status", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #1f2937" : "none", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#1f2937")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ color: "white", fontSize: "13px", fontWeight: "500", margin: 0 }}>{lead.firstName || lead.title} {lead.lastName || ""}</p>
                        <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>{lead.title}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: lead.phone ? "#34d399" : "#374151", fontSize: "13px" }}>{lead.phone || "---"}</td>
                      <td style={{ padding: "14px 16px", color: lead.email ? "#60a5fa" : "#374151", fontSize: "12px" }}>{lead.email || "---"}</td>
                      <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "12px" }}>{lead.city ? lead.city + ", " + lead.state : lead.state || "---"}</td>
                      <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "12px" }}>{lead.serviceCategory || "---"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#1f2937", color: "#9ca3af", fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>{lead.source}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ color: tempColors[lead.temperature] || "#9ca3af", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>{lead.temperature}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: statusColors[lead.status]?.bg || "#1f2937", color: statusColors[lead.status]?.color || "#9ca3af", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "6px" }}>
                          {lead.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          style={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", outline: "none", cursor: "pointer" }}
                        >
                          <option value="new">New</option>
                          <option value="called">Called</option>
                          <option value="interested">Interested</option>
                          <option value="not_interested">Not Interested</option>
                          <option value="no_answer">No Answer</option>
                          <option value="callback">Callback</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="disqualified">Disqualified</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
