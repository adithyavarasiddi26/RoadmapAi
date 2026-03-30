import  { useEffect,useState } from "react";
import { NavLink } from "react-router-dom";

// ─── SIDEBAR NAV ITEMS ────────────────────────────────────────────────────────
const NAV = [
  { icon: "⚡", label: "Overview", id: "overview" },
  { icon: "🗺️", label: "My Roadmaps", id: "roadmaps", badge: "" },
  { icon: "📅", label: "Today's Tasks", id: "dailytasks" },
];

export default function Dashboard({ activePage, setActivePage }) {
    const [details, setDetails] = useState("Default Name");
    useEffect(() => {
        // Fetch user info on mount
        fetch("http://localhost:8000/api/me", {
            credentials: "include", // include cookies
        })
        .then(res => res.json())
        .then(data => setDetails(data));
    }, []);

    return (
        <div>
            <aside className="sidebar">
                <div className="sidebar-logo">
                <div className="logo-mark">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12 L7 2 L12 12" stroke="#00FFB2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 8.5h6" stroke="#00FFB2" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                </div>
                <span className="logo-text">Roadmap<span>AI</span></span>
                </div>
    
                <nav className="sidebar-nav">
                <div className="nav-section-label">Menu</div>
                {NAV.map(item => (
                    <NavLink key={item.id} to={`/dashboard/${item.id}`} className={`nav-item${activePage === item.id ? " active" : ""}`} style={{ textDecoration: "none" }}>
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </NavLink>
                ))}
    
                {/* <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
                <button className="nav-item"><span className="nav-icon">⚙️</span>Settings</button>
                <button className="nav-item"><span className="nav-icon">🔔</span>Notifications</button> */}
                </nav>
    
                <div className="sidebar-footer">
                <div className="user-chip">
                    <div className="avatar">{details.name?.charAt(0).toUpperCase() || "U"}</div>
                    <div className="user-info">
                    <div className="user-name">{details.name || "Default Name"}</div>
                    <div className="user-role">{details.email || "default@example.com"}</div>
                    </div>
                    
                </div>
                </div>
            </aside>
        </div>
    )
}