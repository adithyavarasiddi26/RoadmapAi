import axios from "axios";
import { useEffect, useState } from "react";

export default function TopBar({ activePage, logout, overviewData }) {

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
      logout();
    } catch (err) {
      console.error("Logout failed", err);
      // still call logout locally
      logout();
    }
  };
    return (
        <div>
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <div className="page-title">
                { { overview: "Overview", roadmaps: "My Roadmaps", tasks: "Today's Tasks", progress: "Progress", resources: "Resources" }[activePage] }
              </div>
              <div className="page-sub">
                { { overview: "Welcome back 👋", roadmaps: "Manage your learning paths", tasks: "3 tasks remaining today", progress: "Track your journey", resources: "Curated learning materials" }[activePage] }
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
              background: "rgba(0,255,178,0.06)", border: "1px solid rgba(0,255,178,0.15)",
              borderRadius: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>{overviewData?.study_streak > 0 ? "🔥" : "💔"}</span>
              <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{overviewData?.study_streak || 0} / {overviewData?.total_days || 0} Days</span>
            </div>
            {/* <div className="topbar-btn">🔔</div> */}
            <div className="avatar" onClick={handleLogout} style={{ width: 60, height: 36, borderRadius: 9, cursor: "pointer" }}>Logout</div>
          </div>
        </header>
        </div>
    );
}