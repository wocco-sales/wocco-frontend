"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const US_STATES: any = {
  AL:{name:"Alabama",lat:32.806671,lng:-86.791130},
  AK:{name:"Alaska",lat:61.370716,lng:-152.404419},
  AZ:{name:"Arizona",lat:33.729759,lng:-111.431221},
  AR:{name:"Arkansas",lat:34.969704,lng:-92.373123},
  CA:{name:"California",lat:36.116203,lng:-119.681564},
  CO:{name:"Colorado",lat:39.059811,lng:-105.311104},
  CT:{name:"Connecticut",lat:41.597782,lng:-72.755371},
  DE:{name:"Delaware",lat:39.318523,lng:-75.507141},
  FL:{name:"Florida",lat:27.766279,lng:-81.686783},
  GA:{name:"Georgia",lat:33.040619,lng:-83.643074},
  HI:{name:"Hawaii",lat:21.094318,lng:-157.498337},
  ID:{name:"Idaho",lat:44.240459,lng:-114.478828},
  IL:{name:"Illinois",lat:40.349457,lng:-88.986137},
  IN:{name:"Indiana",lat:39.849426,lng:-86.258278},
  IA:{name:"Iowa",lat:42.011539,lng:-93.210526},
  KS:{name:"Kansas",lat:38.526600,lng:-96.726486},
  KY:{name:"Kentucky",lat:37.668140,lng:-84.670067},
  LA:{name:"Louisiana",lat:31.169960,lng:-91.867805},
  ME:{name:"Maine",lat:44.693947,lng:-69.381927},
  MD:{name:"Maryland",lat:39.063946,lng:-76.802101},
  MA:{name:"Massachusetts",lat:42.230171,lng:-71.530106},
  MI:{name:"Michigan",lat:43.326618,lng:-84.536095},
  MN:{name:"Minnesota",lat:45.694454,lng:-93.900192},
  MS:{name:"Mississippi",lat:32.741646,lng:-89.678696},
  MO:{name:"Missouri",lat:38.456085,lng:-92.288368},
  MT:{name:"Montana",lat:46.921925,lng:-110.454353},
  NE:{name:"Nebraska",lat:41.125370,lng:-98.268082},
  NV:{name:"Nevada",lat:38.313515,lng:-117.055374},
  NH:{name:"New Hampshire",lat:43.452492,lng:-71.563896},
  NJ:{name:"New Jersey",lat:40.298904,lng:-74.521011},
  NM:{name:"New Mexico",lat:34.840515,lng:-106.248482},
  NY:{name:"New York",lat:42.165726,lng:-74.948051},
  NC:{name:"North Carolina",lat:35.630066,lng:-79.806419},
  ND:{name:"North Dakota",lat:47.528912,lng:-99.784012},
  OH:{name:"Ohio",lat:40.388783,lng:-82.764915},
  OK:{name:"Oklahoma",lat:35.565342,lng:-96.928917},
  OR:{name:"Oregon",lat:44.572021,lng:-122.070938},
  PA:{name:"Pennsylvania",lat:40.590752,lng:-77.209755},
  RI:{name:"Rhode Island",lat:41.680893,lng:-71.511780},
  SC:{name:"South Carolina",lat:33.856892,lng:-80.945007},
  SD:{name:"South Dakota",lat:44.299782,lng:-99.438828},
  TN:{name:"Tennessee",lat:35.747845,lng:-86.692345},
  TX:{name:"Texas",lat:31.054487,lng:-97.563461},
  UT:{name:"Utah",lat:40.150032,lng:-111.862434},
  VT:{name:"Vermont",lat:44.045876,lng:-72.710686},
  VA:{name:"Virginia",lat:37.769337,lng:-78.169968},
  WA:{name:"Washington",lat:47.400902,lng:-121.490494},
  WV:{name:"West Virginia",lat:38.491226,lng:-80.954453},
  WI:{name:"Wisconsin",lat:44.268543,lng:-89.616508},
  WY:{name:"Wyoming",lat:42.755966,lng:-107.302490},
};

export default function MapPage() {
  const [stats, setStats] = useState<any>({ byState: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads/stats").then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stateData: any = {};
  stats.byState?.forEach((s: any) => {
    if (s.state) stateData[s.state.toUpperCase()] = parseInt(s.count);
  });

  const maxCount = Math.max(...Object.values(stateData) as number[], 1);

  function getColor(count: number) {
    if (!count) return "#1f2937";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "#1d4ed8";
    if (intensity > 0.5) return "#2563eb";
    if (intensity > 0.25) return "#3b82f6";
    return "#60a5fa";
  }

  function getTextColor(count: number) {
    if (!count) return "#4b5563";
    const intensity = count / maxCount;
    return intensity > 0.25 ? "white" : "#93c5fd";
  }

  const sortedStates = Object.entries(stateData)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 15);

  return (
    <>
      <header style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>Lead Heat Map</h2>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>Lead density across all US states</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#6b7280", fontSize: "11px" }}>Low</span>
            {["#374151","#60a5fa","#3b82f6","#2563eb","#1d4ed8"].map((c,i) => (
              <div key={i} style={{ width: "20px", height: "12px", background: c, borderRadius: "2px" }} />
            ))}
            <span style={{ color: "#6b7280", fontSize: "11px" }}>High</span>
          </div>
        </header>

        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading map data...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>United States — Lead Distribution</h3>
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>{Object.keys(stateData).length} states with leads</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "4px" }}>
                  {Object.entries(US_STATES).map(([code, state]: any) => {
                    const count = stateData[code] || 0;
                    const isSelected = selected === code;
                    return (
                      <div
                        key={code}
                        onClick={() => setSelected(isSelected ? null : code)}
                        style={{
                          background: isSelected ? "#f59e0b" : getColor(count),
                          borderRadius: "6px",
                          padding: "8px 4px",
                          textAlign: "center",
                          cursor: "pointer",
                          border: isSelected ? "2px solid #f59e0b" : "1px solid #374151",
                          transition: "all 0.15s",
                          position: "relative",
                        }}
                        title={state.name + ": " + count + " leads"}
                      >
                        <p style={{ color: isSelected ? "#030712" : getTextColor(count), fontSize: "9px", fontWeight: "700", margin: 0 }}>{code}</p>
                        {count > 0 && <p style={{ color: isSelected ? "#030712" : "rgba(255,255,255,0.8)", fontSize: "8px", margin: "1px 0 0", fontWeight: "600" }}>{count}</p>}
                      </div>
                    );
                  })}
                </div>

                {selected && (
                  <div style={{ marginTop: "20px", background: "#1f2937", borderRadius: "12px", padding: "16px", border: "1px solid #374151" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: "0 0 4px" }}>{US_STATES[selected]?.name}</h4>
                        <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>State code: {selected}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#60a5fa", fontSize: "28px", fontWeight: "900", margin: 0 }}>{stateData[selected] || 0}</p>
                        <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>leads</p>
                      </div>
                      <a href={"/dashboard/leads?state=" + selected} style={{ background: "#2563eb", color: "white", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                        View Leads
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 14px" }}>Top States by Leads</h3>
                  {sortedStates.length === 0 ? (
                    <p style={{ color: "#4b5563", fontSize: "12px" }}>No state data yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {sortedStates.map(([code, count]: any, i) => (
                        <div key={code} onClick={() => setSelected(code)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "6px 8px", borderRadius: "8px", background: selected === code ? "#1f2937" : "transparent" }}>
                          <span style={{ color: "#4b5563", fontSize: "11px", width: "16px", flexShrink: 0 }}>#{i+1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ color: "white", fontSize: "12px", fontWeight: "500" }}>{US_STATES[code]?.name || code}</span>
                              <span style={{ color: "#60a5fa", fontSize: "12px", fontWeight: "700" }}>{count}</span>
                            </div>
                            <div style={{ height: "4px", background: "#1f2937", borderRadius: "2px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: (count / maxCount * 100) + "%", background: "#2563eb", borderRadius: "2px" }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 12px" }}>Coverage Summary</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { label: "States with leads", value: Object.keys(stateData).length + " / 50", color: "#60a5fa" },
                      { label: "Total leads mapped", value: Object.values(stateData).reduce((a: any, b: any) => a + b, 0), color: "#34d399" },
                      { label: "Top state", value: sortedStates[0] ? (US_STATES[sortedStates[0][0] as string]?.name || sortedStates[0][0]) : "N/A", color: "#fbbf24" },
                      { label: "Avg per state", value: Object.keys(stateData).length > 0 ? Math.round((Object.values(stateData).reduce((a: any, b: any) => a + b, 0) as number) / Object.keys(stateData).length) : 0, color: "#a78bfa" },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>{s.label}</span>
                        <span style={{ color: s.color, fontSize: "13px", fontWeight: "700" }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
    </>
  );
}


