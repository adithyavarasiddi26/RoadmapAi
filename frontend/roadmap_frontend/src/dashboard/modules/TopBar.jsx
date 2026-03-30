import axios from "axios";
import { useEffect, useState } from "react";

export default function TopBar({ activePage, logout, overviewData }) {
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
    async function overviewStats() {
    try {
      const response = await axios.get("http://localhost:8000/api/overview", { withCredentials: true });
      console.log("DEBUG: Fetched overview data:", response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch overview data", err);
      return null;
    }
  }
  useEffect(() => {
    const fetchOverviewData = async () => {
      const data = await overviewStats();
      if (data) {
        setStudyStreak(data.study_streak);
        setTotalDays(data.total_days);
      }
    };
    fetchOverviewData();
  }, [overviewData]);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      if (logout) logout();
    }
  }


  // const handleLogout = async () => {
  //   try {
  //     await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
  //     logout();
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //     // still call logout locally
  //     logout();
  //   }
  // };


    return (
        <div>
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <div className="page-title">
                { { overview: "Overview", roadmaps: "My Roadmaps", tasks: "Today's Tasks", progress: "Progress", resources: "Resources" }[activePage] }
              </div>
              <div className="page-sub">
                { { overview: "Welcome back 👋", roadmaps: "Manage your learning paths", tasks: "Complete your daily tasks", progress: "Track your journey", resources: "Curated learning materials" }[activePage] }
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
              background: "rgba(0,255,178,0.06)", border: "1px solid rgba(0,255,178,0.15)",
              borderRadius: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>{studyStreak > 0 ? "🔥" : "💔"}</span>
              <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{studyStreak || 0} / {totalDays || 0} Days</span>
            </div>
            {/* <div className="topbar-btn">🔔</div> */}
            <button className="logout-button" onClick={handleLogout} >Logout</button>
          </div>
        </header>
        </div>
    );
}