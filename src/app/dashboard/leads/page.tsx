"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

function displayName(lead: any) {
  if (lead.leadType === "individual") {
    const person = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();
    return person || lead.title || "Individual lead";
  }
  return lead.title || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Business lead";
}

function locationLabel(lead: any) {
  if (lead.city && lead.state) return `${lead.city}, ${lead.state}`;
  return lead.city || lead.state || lead.address || "---";
}

function initials(lead: any) {
  const name = displayName(lead);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, typeFilter]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (typeFilter) params.leadType = typeFilter;
      const res = await api.get("/leads", { params });
      setLeads(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = leads.filter(
    (l) =>
      search === "" ||
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      l.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.address?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase()) ||
      l.state?.toLowerCase().includes(search.toLowerCase()) ||
      l.serviceCategory?.toLowerCase().includes(search.toLowerCase()),
  );

  const individualCount = leads.filter((l) => l.leadType === "individual").length;
  const businessCount = leads.filter((l) => (l.leadType || "business") === "business").length;

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

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch("/leads/" + id + "/status", { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <header
        style={{
          background: "#111827",
          borderBottom: "1px solid #1f2937",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Leads</h2>
          <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>
            {leads.length} leads · {individualCount} individuals · {businessCount} businesses
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/leads/import")}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Import CSV
        </button>
      </header>

      <div
        style={{
          padding: "16px 24px",
          background: "#0f172a",
          borderBottom: "1px solid #1f2937",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { key: "", label: `All (${leads.length})` },
            { key: "individual", label: `Individuals (${individualCount})` },
            { key: "business", label: `Businesses (${businessCount})` },
          ].map((tab) => (
            <button
              key={tab.key || "all"}
              onClick={() => setTypeFilter(tab.key)}
              style={{
                background: typeFilter === tab.key ? "#2563eb" : "#1f2937",
                border: `1px solid ${typeFilter === tab.key ? "#2563eb" : "#374151"}`,
                color: typeFilter === tab.key ? "white" : "#9ca3af",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email, location, work..."
          style={{
            flex: 1,
            minWidth: "220px",
            background: "#1f2937",
            border: "1px solid #374151",
            color: "white",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            color: "white",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            outline: "none",
          }}
        >
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
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            color: "white",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            outline: "none",
          }}
        >
          <option value="">All Sources</option>
          <option value="google">Google</option>
          <option value="people">People Finder</option>
          <option value="craigslist">Craigslist</option>
          <option value="facebook">Facebook</option>
          <option value="csv_import">CSV Import</option>
          <option value="manual">Manual</option>
        </select>
        <button
          onClick={fetchLeads}
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            color: "#9ca3af",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 6px" }}>No leads found</p>
            <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>
              Run Individual or Business scrape, then import results
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((lead) => {
              const isPerson = lead.leadType === "individual";
              return (
                <div
                  key={lead.id}
                  style={{
                    background: "#111827",
                    border: `1px solid ${isPerson ? "rgba(168,85,247,0.35)" : "rgba(96,165,250,0.28)"}`,
                    borderRadius: "16px",
                    padding: "16px",
                    display: "grid",
                    gridTemplateColumns: "72px 1.4fr 1fr 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => router.push("/dashboard/leads/" + lead.id)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: isPerson ? "50%" : "14px",
                      border: "none",
                      overflow: "hidden",
                      padding: 0,
                      cursor: "pointer",
                      background: isPerson ? "#4c1d95" : "#1e3a8a",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {lead.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lead.imageUrl}
                        alt={displayName(lead)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      initials(lead)
                    )}
                  </button>

                  <div style={{ cursor: "pointer" }} onClick={() => router.push("/dashboard/leads/" + lead.id)}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span
                        style={{
                          background: isPerson ? "rgba(168,85,247,0.18)" : "rgba(96,165,250,0.18)",
                          color: isPerson ? "#c084fc" : "#60a5fa",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: 999,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {isPerson ? "INDIVIDUAL" : "BUSINESS"}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: 10, textTransform: "uppercase" }}>
                        {lead.source}
                      </span>
                    </div>
                    <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: 0 }}>{displayName(lead)}</p>
                    <p style={{ color: "#9ca3af", fontSize: 12, margin: "4px 0 0" }}>
                      {isPerson
                        ? lead.serviceCategory || lead.serviceType || lead.title
                        : lead.serviceCategory || lead.website || "Business listing"}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: "#6b7280", fontSize: 11, margin: "0 0 4px" }}>Contact</p>
                    <p style={{ color: lead.phone ? "#34d399" : "#4b5563", fontSize: 12, margin: 0 }}>
                      {lead.phone || "No phone"}
                    </p>
                    <p style={{ color: lead.email ? "#60a5fa" : "#4b5563", fontSize: 12, margin: "4px 0 0" }}>
                      {lead.email || "No email"}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: "#6b7280", fontSize: 11, margin: "0 0 4px" }}>
                      {isPerson ? "Location / Work" : "Location / Category"}
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: 12, margin: 0 }}>{locationLabel(lead)}</p>
                    <p style={{ color: "#9ca3af", fontSize: 12, margin: "4px 0 0" }}>
                      {lead.serviceCategory || lead.serviceType || "---"}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <span
                      style={{
                        background: statusColors[lead.status]?.bg || "#1f2937",
                        color: statusColors[lead.status]?.color || "#9ca3af",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {lead.status?.replace("_", " ")}
                    </span>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      style={{
                        background: "#1f2937",
                        border: "1px solid #374151",
                        color: "white",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 11,
                        outline: "none",
                        cursor: "pointer",
                      }}
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
