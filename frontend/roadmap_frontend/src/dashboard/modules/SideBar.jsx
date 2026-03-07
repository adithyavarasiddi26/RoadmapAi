// ─── SIDEBAR NAV ITEMS ────────────────────────────────────────────────────────
const NAV = [
  { icon: "⚡", label: "Overview", id: "overview" },
  { icon: "🗺️", label: "My Roadmaps", id: "roadmaps", badge: "3" },
  { icon: "📅", label: "Today's Tasks", id: "tasks" },
  { icon: "📈", label: "Progress", id: "progress" },
  { icon: "📚", label: "Resources", id: "resources" },
];

export default function Dashboard({ activePage, setActivePage }) {

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
                    <button key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`}
                    onClick={() => setActivePage(item.id)}>
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </button>
                ))}
    
                <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
                <button className="nav-item"><span className="nav-icon">⚙️</span>Settings</button>
                <button className="nav-item"><span className="nav-icon">🔔</span>Notifications</button>
                </nav>
    
                <div className="sidebar-footer">
                <div className="user-chip">
                    <div className="avatar">A</div>
                    <div className="user-info">
                    <div className="user-name">Alex Johnson</div>
                    <div className="user-role">Pro Plan</div>
                    </div>
                    <div style={{ color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>↗</div>
                </div>
                </div>
            </aside>
        </div>
    )
}