"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

type ScrapeStatus = "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT" | "ABORTED";

interface ScrapeRun {
  runId: string;
  status: ScrapeStatus;
  source?: string;
  target?: string;
}

interface ImportResult {
  imported: number;
  scraped: number;
  skipped: number;
}

const STATUS_COLORS: Record<string, string> = {
  READY: "#60a5fa",
  RUNNING: "#fbbf24",
  SUCCEEDED: "#34d399",
  FAILED: "#ef4444",
  "TIMED-OUT": "#ef4444",
  ABORTED: "#6b7280",
};

export default function ScrapePage() {
  const router = useRouter();
  const [target, setTarget] = useState("business");
  const [source, setSource] = useState("google");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  const [run, setRun] = useState<ScrapeRun | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [importing, setImporting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [router]);

  function startPolling(runId: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/scraper/runs/${runId}`);
        setRun((prev) => (prev ? { ...prev, ...res.data } : res.data));
        if (["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(res.data.status)) {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 5000);
  }

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setImportResult(null);
    setStarting(true);
    try {
      const res = await api.post("/scraper/run", {
        target,
        source,
        query,
        location,
        maxResults,
      });
      setRun(res.data);
      startPolling(res.data.runId);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to start scrape"));
    } finally {
      setStarting(false);
    }
  }

  async function handleImport() {
    if (!run) return;
    setImporting(true);
    setError("");
    try {
      const res = await api.post(`/scraper/runs/${run.runId}/import`, {
        source: run.source || source,
        target: run.target || target,
      });
      setImportResult(res.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Import failed"));
    } finally {
      setImporting(false);
    }
  }

  const statusColor = (run?.status ? STATUS_COLORS[run.status] : undefined) || "#9ca3af";
  const inputStyle = { width: "100%", background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { color: "#9ca3af", fontSize: "12px", fontWeight: "600" as const, display: "block", marginBottom: "6px" };

  return (
    <>
      <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Lead Scraper</h2>
        <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>Run Apify scrapers and import results as leads</p>
      </header>

      <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <form onSubmit={handleStart} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 20px" }}>New Scrape</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Lead Type</label>
                <select
                  value={target}
                  onChange={(e) => {
                    const next = e.target.value;
                    setTarget(next);
                    if (next === "individual") {
                      setSource("craigslist");
                      setMaxResults(20);
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="business">Business</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Source</label>
                <select
                  value={source}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSource(next);
                    setMaxResults(next === "craigslist" ? 20 : 50);
                  }}
                  style={inputStyle}
                >
                  <option value="google" disabled={target === "individual"}>
                    Google Maps (businesses only)
                  </option>
                  <option value="craigslist">Craigslist</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Max Results</label>
                <input type="number" min={1} max={100} value={maxResults} onChange={(e) => setMaxResults(parseInt(e.target.value) || 50)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Search Query</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  target === "individual"
                    ? 'e.g. "person selling lawn mower"'
                    : 'e.g. "roofing contractors"'
                }
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>{source === "craigslist" ? "City (craigslist subdomain, e.g. dallas)" : "Location (required)"}</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={source === "craigslist" ? "dallas" : "e.g. Dallas, TX, USA"}
                required={source === "google"}
                style={inputStyle}
              />
            </div>
            {source === "google" ? (
              <p style={{ color: "#4b5563", fontSize: "11px", margin: "0 0 20px" }}>
                Uses Google Maps business listings — imports phone, full address, city, state, zip, and category.
              </p>
            ) : target === "individual" ? (
              <p style={{ color: "#4b5563", fontSize: "11px", margin: "0 0 20px" }}>
                Searches public, owner-posted Craigslist listings. It does not search private people or private personal data.
              </p>
            ) : (
              <p style={{ color: "#4b5563", fontSize: "11px", margin: "0 0 20px" }}>
                Searches Craigslist service listings with your rented Ivanvs actor. Keep Max Results lower (e.g. 20) for shorter runs.
              </p>
            )}

            <button type="submit" disabled={starting} style={{ background: "#2563eb", border: "none", color: "white", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", cursor: starting ? "wait" : "pointer", opacity: starting ? 0.7 : 1 }}>
              {starting ? "Starting..." : "Run Scrape"}
            </button>
          </form>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "14px 16px", color: "#ef4444", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {run && (
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>Scrape Run</h3>
                <span style={{ background: statusColor + "22", color: statusColor, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "6px" }}>
                  {run.status}
                </span>
              </div>

              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>Run ID: <span style={{ color: "#9ca3af" }}>{run.runId}</span></p>
              {run.status === "RUNNING" || run.status === "READY" ? (
                <p style={{ color: "#fbbf24", fontSize: "12px", margin: "12px 0 0" }}>Scraping in progress — this page checks status every 5 seconds...</p>
              ) : run.status === "SUCCEEDED" ? (
                <button onClick={handleImport} disabled={importing} style={{ marginTop: "16px", background: "#10b981", border: "none", color: "white", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", cursor: importing ? "wait" : "pointer", opacity: importing ? 0.7 : 1 }}>
                  {importing ? "Importing..." : "Import Results as Leads"}
                </button>
              ) : (
                <p style={{ color: "#ef4444", fontSize: "12px", margin: "12px 0 0" }}>Run did not complete successfully. Check your Apify console for details.</p>
              )}

              {importResult && (
                <div style={{ marginTop: "16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "12px", padding: "16px" }}>
                  <p style={{ color: "#34d399", fontSize: "13px", fontWeight: "600", margin: "0 0 4px" }}>
                    Imported {importResult.imported} new lead{importResult.imported === 1 ? "" : "s"}
                  </p>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 12px" }}>
                    {importResult.scraped} scraped, {importResult.skipped} skipped as duplicates
                  </p>
                  <a href="/dashboard/leads" style={{ background: "#2563eb", color: "white", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>View Leads</a>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
