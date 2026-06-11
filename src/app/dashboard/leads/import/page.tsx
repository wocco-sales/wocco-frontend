"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<any>({});
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const leadFields = ["title","firstName","lastName","phone","email","address","city","state","zipCode","serviceCategory","serviceType","notes","sourceUrl"];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      const hdrs = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
      setHeaders(hdrs);
      const rows = lines.slice(1, 6).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
        const obj: any = {};
        hdrs.forEach((h, i) => obj[h] = vals[i] || "");
        return obj;
      });
      setPreview(rows);
      const autoMap: any = {};
      hdrs.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes("first")) autoMap[h] = "firstName";
        else if (lower.includes("last")) autoMap[h] = "lastName";
        else if (lower.includes("phone") || lower.includes("mobile")) autoMap[h] = "phone";
        else if (lower.includes("email")) autoMap[h] = "email";
        else if (lower.includes("city")) autoMap[h] = "city";
        else if (lower.includes("state")) autoMap[h] = "state";
        else if (lower.includes("zip")) autoMap[h] = "zipCode";
        else if (lower.includes("address")) autoMap[h] = "address";
        else if (lower.includes("title") || lower.includes("name") || lower.includes("company")) autoMap[h] = "title";
        else if (lower.includes("category") || lower.includes("service")) autoMap[h] = "serviceCategory";
        else autoMap[h] = "";
      });
      setMapping(autoMap);
    };
    reader.readAsText(f);
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setError("");
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      const hdrs = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
      const leads = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
        const obj: any = { source: "csv_import" };
        hdrs.forEach((h, i) => {
          const field = mapping[h];
          if (field && vals[i]) obj[field] = vals[i];
        });
        if (!obj.title) obj.title = [obj.firstName, obj.lastName].filter(Boolean).join(" ") || "Imported Lead";
        return obj;
      }).filter(l => l.title || l.firstName || l.phone);

      const res = await api.post("/leads/bulk", { leads });
      setResult({ success: true, count: res.data.length });
    } catch (e: any) {
      setError(e.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => router.push("/dashboard/leads")} style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>← Back</button>
            <div>
              <h2 style={{ color: "white", fontWeight: "700", fontSize: "20px", margin: 0 }}>Import Leads from CSV</h2>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "2px 0 0" }}>Upload a CSV file and map columns to lead fields</p>
            </div>
          </div>

          {!file ? (
            <div style={{ border: "2px dashed #374151", borderRadius: "16px", padding: "60px", textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px" }}>Drop your CSV file here or click to browse</p>
              <label style={{ background: "#2563eb", color: "white", borderRadius: "8px", padding: "10px 24px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
              </label>
              <p style={{ color: "#374151", fontSize: "11px", margin: "16px 0 0" }}>Supports: name, phone, email, city, state, zip, service category</p>
            </div>
          ) : (
            <div>
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{file.name}</p>
                  <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>{headers.length} columns detected</p>
                </div>
                <button onClick={() => { setFile(null); setPreview([]); setHeaders([]); setMapping({}); setResult(null); }} style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>Change File</button>
              </div>

              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600", margin: "0 0 16px" }}>Map CSV Columns to Lead Fields</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {headers.map(h => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "12px", flex: 1, background: "#1f2937", padding: "6px 10px", borderRadius: "6px" }}>{h}</span>
                      <span style={{ color: "#4b5563", fontSize: "11px" }}>→</span>
                      <select value={mapping[h] || ""} onChange={e => setMapping({ ...mapping, [h]: e.target.value })} style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none" }}>
                        <option value="">Skip</option>
                        {leadFields.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {preview.length > 0 && (
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", marginBottom: "20px", overflow: "auto" }}>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600", margin: "0 0 12px" }}>Preview (first 5 rows)</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                    <thead>
                      <tr>{headers.map(h => <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: "#6b7280", borderBottom: "1px solid #1f2937" }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i}>{headers.map(h => <td key={h} style={{ padding: "6px 10px", color: "#9ca3af", borderBottom: "1px solid #1f2937" }}>{row[h] || "---"}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}

              {result?.success && (
                <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "700", margin: "0 0 4px" }}>Import successful!</p>
                  <p style={{ fontSize: "13px", margin: 0 }}>{result.count} leads imported successfully.</p>
                  <button onClick={() => router.push("/dashboard/leads")} style={{ marginTop: "12px", background: "#34d399", color: "#030712", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>View Leads →</button>
                </div>
              )}

              {!result?.success && (
                <button onClick={handleImport} disabled={importing} style={{ background: importing ? "#1e40af" : "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "14px", fontWeight: "700", cursor: importing ? "not-allowed" : "pointer", width: "100%" }}>
                  {importing ? "Importing..." : "Import Leads"}
                </button>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
