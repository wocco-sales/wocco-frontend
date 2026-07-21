"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [leadType, setLeadType] = useState("business");
  const [callbackDate, setCallbackDate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchLead();
  }, []);

  async function fetchLead() {
    try {
      const res = await api.get("/leads/" + params.id);
      setLead(res.data);
      setStatus(res.data.status);
      setLeadType(res.data.leadType || "business");
      if (res.data.callbackDate) setCallbackDate(res.data.callbackDate.slice(0, 16));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.patch("/leads/" + params.id + "/status", {
        status,
        notes: note || lead.notes,
      });
      await api.patch("/leads/" + params.id + "/type", { leadType });
      if (callbackDate) {
        await api.patch("/leads/" + params.id + "/callback", { callbackDate });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchLead();
      setNote("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const statusColors: any = {
    new: "#60a5fa", called: "#fbbf24", interested: "#34d399",
    not_interested: "#ef4444", no_answer: "#9ca3af",
    callback: "#a855f7", closed_won: "#10b981", disqualified: "#6b7280",
  };

  const tempColors: any = { hot: "#ef4444", warm: "#f97316", cold: "#60a5fa" };

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6b7280" }}>Loading lead...</p>
    </div>
  );

  if (!lead) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#ef4444" }}>Lead not found</p>
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
        <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => router.push("/dashboard/leads")} style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: 0 }}>
              {lead.firstName ? `${lead.firstName} ${lead.lastName || ""}` : lead.title}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>Lead ID: {lead.id}</p>
          </div>
          <span style={{ background: "rgba(96,165,250,0.1)", color: tempColors[lead.temperature], border: "1px solid " + tempColors[lead.temperature] + "40", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "6px", textTransform: "uppercase" }}>
            {lead.temperature}
          </span>
          <span style={{ background: "rgba(96,165,250,0.1)", color: statusColors[lead.status], fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "6px" }}>
            {lead.status?.replace(/_/g, " ").toUpperCase()}
          </span>
        </header>

        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "1100px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #1f2937" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Full Name", value: (lead.firstName || "") + " " + (lead.lastName || "") },
                  { label: "Phone", value: lead.phone, color: "#34d399" },
                  { label: "Email", value: lead.email, color: "#60a5fa" },
                  { label: "Address", value: lead.address },
                  { label: "City", value: lead.city },
                  { label: "State", value: lead.state },
                  { label: "Zip Code", value: lead.zipCode },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>{f.label}</span>
                    <span style={{ color: f.color || "#e5e7eb", fontSize: "13px", fontWeight: "500" }}>{f.value || "---"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #1f2937" }}>Lead Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Lead Type", value: (lead.leadType || "business").toUpperCase() },
                  { label: "Service Category", value: lead.serviceCategory },
                  { label: "Service Type", value: lead.serviceType },
                  { label: "Source", value: lead.source?.toUpperCase() },
                  { label: "Score", value: lead.score + " / 100" },
                  { label: "Created", value: new Date(lead.createdAt).toLocaleDateString() },
                  { label: "Last Updated", value: new Date(lead.updatedAt).toLocaleDateString() },
                  { label: "Assigned To", value: lead.assignedAgent ? lead.assignedAgent.firstName + " " + lead.assignedAgent.lastName : "Unassigned" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>{f.label}</span>
                    <span style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: "500" }}>{f.value || "---"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #1f2937" }}>Update Lead</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>Lead Type</label>
                  <select value={leadType} onChange={e => setLeadType(e.target.value)} style={{ width: "100%", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", outline: "none" }}>
                    <option value="business">Business</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", outline: "none" }}>
                    <option value="new">New</option>
                    <option value="called">Called</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="no_answer">No Answer</option>
                    <option value="callback">Callback Requested</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="disqualified">Disqualified</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>Callback Date & Time</label>
                  <input type="datetime-local" value={callbackDate} onChange={e => setCallbackDate(e.target.value)} style={{ width: "100%", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>Call Notes</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add notes from this call..." rows={4} style={{ width: "100%", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                {saved && (
                  <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "8px", padding: "10px 14px", fontSize: "12px" }}>
                    Lead updated successfully
                  </div>
                )}
                <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#1e40af" : "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "13px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {lead.notes && (
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 12px" }}>Previous Notes</h3>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>{lead.notes}</p>
              </div>
            )}

            {lead.sourceUrl && (
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 12px" }}>Source URL</h3>
                <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", fontSize: "12px", wordBreak: "break-all" }}>{lead.sourceUrl}</a>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}