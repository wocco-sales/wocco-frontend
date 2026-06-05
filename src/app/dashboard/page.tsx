"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(getUser());
  }, [router]);

  if (!user) {
    return (
      <div style={{background:"#030712",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <p style={{color:"#6b7280"}}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{background:"#030712",minHeight:"100vh",display:"flex"}}>
      <aside style={{width:"240px",background:"#111827",borderRight:"1px solid #1f2937",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"24px",borderBottom:"1px solid #1f2937"}}>
          <h1 style={{color:"#60a5fa",fontWeight:"900",fontSize:"24px",margin:0}}>WOCCO</h1>
          <p style={{color:"#4b5563",fontSize:"11px",margin:"2px 0 0"}}>Sales Lead Platform</p>
        </div>
        <nav style={{flex:1,padding:"16px"}}>
          {[
            {label:"Dashboard",href:"/dashboard"},
            {label:"Leads",href:"/dashboard/leads"},
            {label:"Heat Map",href:"/dashboard/map"},
            ...(user.role==="admin"||user.role==="super_admin"?[
              {label:"Agents",href:"/dashboard/agents"},
              {label:"Analytics",href:"/dashboard/analytics"},
              {label:"Settings",href:"/dashboard/settings"},
            ]:[]),
          ].map((item) => (
            <a key={item.href} href={item.href} style={{display:"flex",alignItems:"center",padding:"10px 12px",borderRadius:"8px",color:"#9ca3af",textDecoration:"none",fontSize:"13px",marginBottom:"2px",transition:"all 0.15s"}}
              onMouseEnter={e=>{(e.target as HTMLElement).style.background="#1f2937";(e.target as HTMLElement).style.color="#fff"}}
              onMouseLeave={e=>{(e.target as HTMLElement).style.background="transparent";(e.target as HTMLElement).style.color="#9ca3af"}}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{padding:"16px",borderTop:"1px solid #1f2937"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:"#1f2937",borderRadius:"10px"}}>
            <div style={{width:"30px",height:"30px",borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"11px",fontWeight:"bold",flexShrink:0}}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{color:"white",fontSize:"12px",fontWeight:"600",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.firstName} {user.lastName}</p>
              <p style={{color:"#6b7280",fontSize:"11px",margin:0,textTransform:"capitalize"}}>{user.role}</p>
            </div>
            <button onClick={logout} style={{background:"none",border:"none",color:"#4b5563",cursor:"pointer",fontSize:"12px",padding:"2px"}} title="Sign out">✕</button>
          </div>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:"#111827",borderBottom:"1px solid #1f2937",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h2 style={{color:"white",fontWeight:"600",fontSize:"15px",margin:0}}>Dashboard</h2>
            <p style={{color:"#6b7280",fontSize:"11px",margin:"2px 0 0"}}>Overview of your lead pipeline</p>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button style={{background:"#2563eb",color:"white",border:"none",borderRadius:"8px",padding:"8px 16px",fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>+ Import Leads</button>
            <button style={{background:"#1f2937",color:"white",border:"1px solid #374151",borderRadius:"8px",padding:"8px 16px",fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>Run Scrape</button>
          </div>
        </header>

        <main style={{flex:1,overflow:"auto",padding:"24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"24px"}}>
            {[
              {label:"Total Leads",value:"0",sub:"In database",color:"#60a5fa",bg:"rgba(96,165,250,0.1)",border:"rgba(96,165,250,0.2)"},
              {label:"New Today",value:"0",sub:"Added today",color:"#34d399",bg:"rgba(52,211,153,0.1)",border:"rgba(52,211,153,0.2)"},
              {label:"Called",value:"0",sub:"Contacted",color:"#fbbf24",bg:"rgba(251,191,36,0.1)",border:"rgba(251,191,36,0.2)"},
              {label:"Closed Won",value:"0",sub:"Converted",color:"#a78bfa",bg:"rgba(167,139,250,0.1)",border:"rgba(167,139,250,0.2)"},
            ].map((s) => (
              <div key={s.label} style={{background:"#111827",border:"1px solid "+s.border,borderRadius:"16px",padding:"20px"}}>
                <span style={{background:s.bg,color:s.color,fontSize:"11px",fontWeight:"600",padding:"3px 10px",borderRadius:"6px",display:"inline-block",marginBottom:"12px"}}>{s.label}</span>
                <p style={{color:s.color,fontSize:"32px",fontWeight:"900",margin:"0 0 2px"}}>{s.value}</p>
                <p style={{color:"#4b5563",fontSize:"11px",margin:0}}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"16px",marginBottom:"16px"}}>
            <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:"16px",padding:"24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                <h3 style={{color:"white",fontWeight:"600",fontSize:"14px",margin:0}}>Recent Leads</h3>
                <a href="/dashboard/leads" style={{color:"#60a5fa",fontSize:"12px",textDecoration:"none"}}>View all</a>
              </div>
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <p style={{color:"#4b5563",fontSize:"13px",margin:"0 0 4px"}}>No leads yet</p>
                <p style={{color:"#374151",fontSize:"11px",margin:0}}>Import leads or run a scrape to get started</p>
              </div>
            </div>

            <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:"16px",padding:"24px"}}>
              <h3 style={{color:"white",fontWeight:"600",fontSize:"14px",margin:"0 0 16px"}}>Quick Actions</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {[
                  {label:"Import CSV",desc:"Upload lead list",color:"#60a5fa"},
                  {label:"Run Scrape",desc:"Auto-fetch leads",color:"#34d399"},
                  {label:"View Heat Map",desc:"Lead density map",color:"#a78bfa"},
                  {label:"Add Agent",desc:"Create account",color:"#fbbf24"},
                ].map((a) => (
                  <div key={a.label} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"10px",background:"rgba(255,255,255,0.03)",cursor:"pointer"}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",background:a.color,flexShrink:0}}></div>
                    <div>
                      <p style={{color:"white",fontSize:"12px",fontWeight:"500",margin:0}}>{a.label}</p>
                      <p style={{color:"#6b7280",fontSize:"11px",margin:0}}>{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{background:"linear-gradient(135deg,#1e3a5f,#111827)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:"16px",padding:"24px"}}>
            <h3 style={{color:"white",fontWeight:"600",fontSize:"15px",margin:"0 0 6px"}}>Welcome back, {user.firstName} 👋</h3>
            <p style={{color:"#9ca3af",fontSize:"13px",margin:0}}>Your WOCCO sales platform is live and ready. Start by importing your first leads or running a scrape across Google, Craigslist, and Facebook to begin filling your pipeline.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
