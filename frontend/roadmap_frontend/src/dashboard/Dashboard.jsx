import "./Dashboard.css";
import { useState, useEffect, use } from "react";
import TopBar from "./modules/TopBar";
import SideBar from "./modules/SideBar";
import CreateRoadmapModal from "./modules/CreateRoadmapModal";
import GeneratingView from "./modules/GeneratingView";
import axios from "axios";

    // ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ROADMAPS = [
  // {
  //   id: 1, title: "Full-Stack SWE at Google",
  //   target: "Senior SWE", progress: 38, weeks: 24, phase: "Phase 2 · DSA & System Design",
  //   status: "active", tags: ["6 Phases", "24 Weeks", "Advanced"]
  // },
  // {
  //   id: 2, title: "ML Engineer Transition",
  //   target: "ML Engineer", progress: 12, weeks: 32, phase: "Phase 1 · Python & Math",
  //   status: "active", tags: ["8 Phases", "32 Weeks", "Intermediate"]
  // },
  // {
  //   id: 3, title: "Frontend React Specialist",
  //   target: "Frontend Lead", progress: 0, weeks: 16, phase: "Not started",
  //   status: "draft", tags: ["4 Phases", "16 Weeks", "Intermediate"]
  // }
];

const ACTIVITIES = [
  { icon: "✅", bg: "rgba(0,255,178,0.1)", text: "Completed Phase 1 of Full-Stack SWE roadmap", time: "2 hours ago" },
  { icon: "🎯", bg: "rgba(123,97,255,0.1)", text: "Unlocked Phase 2 — DSA & System Design", time: "2 hours ago" },
  { icon: "📚", bg: "rgba(255,255,255,0.06)", text: "Added resource: CS50 Problem Sets", time: "Yesterday" },
  { icon: "🔥", bg: "rgba(255,78,106,0.1)", text: "7-day streak achieved! Keep it up", time: "Yesterday" },
];

const MOCK_ROADMAP_RESULT = {
  roadmap_title: "Full-Stack SWE Mastery Path",
  total_duration_weeks: 24,
  phases: [
    {
      phase_name: "Foundations & Core CS",
      focus_area: "Programming & Computer Science Basics",
      duration_weeks: 4,
      topics: ["Data Types & OOP", "Complexity Analysis", "Recursion", "Git & Linux Basics"],
      expected_outcome: "Solid programming foundation ready for advanced data structures.",
      status: "done"
    },
    {
      phase_name: "Data Structures & Algorithms",
      focus_area: "DSA Mastery",
      duration_weeks: 6,
      topics: ["Arrays & Strings", "Trees & Graphs", "DP Patterns", "Sorting & Searching", "LeetCode 75"],
      expected_outcome: "Solve medium-hard DSA problems confidently under time pressure.",
      status: "active"
    },
    {
      phase_name: "System Design & Architecture",
      focus_area: "Scalable Systems",
      duration_weeks: 5,
      topics: ["Distributed Systems", "Database Design", "Caching & CDN", "Load Balancing", "API Design"],
      expected_outcome: "Design scalable systems for 10M+ user products with confidence.",
      status: "locked"
    },
    {
      phase_name: "Full-Stack Development",
      focus_area: "Frontend + Backend",
      duration_weeks: 5,
      topics: ["React & Next.js", "Node.js & Express", "PostgreSQL", "REST & GraphQL", "Auth & Security"],
      expected_outcome: "Build and ship production-grade full-stack applications end-to-end.",
      status: "locked"
    },
    {
      phase_name: "Interview Preparation",
      focus_area: "Behavioral + Technical",
      duration_weeks: 4,
      topics: ["STAR Method", "Mock Interviews", "System Design Practice", "Offer Negotiation"],
      expected_outcome: "Crack technical interviews at top-tier companies with confidence.",
      status: "locked"
    },
  ],
  final_capstone: {
    title: "SaaS Platform End-to-End Build",
    description: "Design and build a full-stack SaaS application handling 10k concurrent users, with a React frontend, Node.js backend, PostgreSQL database, Redis caching, and complete CI/CD pipeline.",
    skills_validated: ["System Design", "DSA Application", "Full-Stack Engineering", "DevOps Basics", "Product Thinking"]
  }
};



const handleDeleteRoadmap = async () => {
  // Implement roadmap deletion logic here
  window.confirm("Are you sure you want to delete this roadmap? This action cannot be undone.");
  const response = await axios.delete("http://localhost:8000/roadmap", { withCredentials: true }).then(res => res.data).catch(err => {
    console.error("Failed to delete roadmap", err);
    alert("Failed to delete roadmap. Please try again.");
  });
  if (response && !response.error) {
    alert("Roadmap deleted successfully.");
    window.location.reload(); // Refresh to update the UI
  }
}


// ─── ROADMAP VIEWER MODAL ──────────────────────────────────────────────────────
function RoadmapViewerModal({ roadmap, onClose }) {
  const statusOrder = { done: 0, active: 1, locked: 2 };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-modal" style={{ maxWidth: 740 }} onClick={e => e.stopPropagation()}>
        <div className="form-modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="form-modal-title" style={{ fontSize: 18 }}>{roadmap.roadmap_title}</div>
          <div className="form-modal-sub">{roadmap.total_duration_weeks} weeks · {roadmap.phases.length} phases</div>
          {console.log("DEBUG: Rendering roadmap viewer with roadmap data:", roadmap.phases)}
        </div>
        <div className="form-body" style={{ padding: "24px 28px 28px" }}>
          <div className="phases-timeline">
            {roadmap.phases.map((p, i) => (
              <div key={i} className="phase-item">
                <div className="phase-spine">
                  <div className={`phase-node${p.status === "active" ? " active" : ""}${p.status === "done" ? " done" : ""}`}>
                    {p.status === "done" ? "✓" : i + 1}
                  </div>
                  {i < roadmap.phases.length - 1 && <div className={`phase-line${p.status === "done" ? " done" : ""}`} />}
                </div>
                <div className="phase-content">
                  <div className={`phase-card${p.status === "active" ? " active" : ""}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div className="phase-name">{p.phase_name}</div>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20,
                        background: p.status === "done" ? "rgba(0,255,178,0.1)" : p.status === "active" ? "rgba(123,97,255,0.12)" : "rgba(255,255,255,0.05)",
                        color: p.status === "done" ? "#00FFB2" : p.status === "active" ? "#7B61FF" : "#6B6880",
                        border: `1px solid ${p.status === "done" ? "rgba(0,255,178,0.2)" : p.status === "active" ? "rgba(123,97,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                        fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase"
                      }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="phase-duration">{p.focus_area} · {p.duration_weeks} weeks</div>
                    <div className="topics-wrap">
                      {p.topics.map(t => <span key={t} className="topic-tag">{t}</span>)}
                    </div>
                    <div className="phase-outcome">🎯 {p.expected_outcome}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Capstone */}
          <div className="capstone-card">
            <div className="capstone-badge">Final Capstone</div>
            <div className="capstone-title">{roadmap.final_capstone.title}</div>
            <div className="capstone-desc">{roadmap.final_capstone.description}</div>
            <div className="skills-chips">
              {roadmap.final_capstone.skills_validated.map(s => (
                <span key={s} className="skill-chip">{s}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
            <button className="delete-button" onClick={handleDeleteRoadmap} >Delete Roadmap</button>
          </div>
        </div>
      </div>
    </div>
  );
}

//generate view while waiting for roadmap generation to complete



// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [viewingRoadmap, setViewingRoadmap] = useState(null);
  const [roadmapCard, setRoadmapCard] = useState([]);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleGenerate = async (formData) => {
    setShowCreate(false);
    setGenerating(true);
    try {
      const res = await axios.post("http://localhost:8000/generate_roadmap", formData, { withCredentials: true });
      const data = res.data;
      if (data.error) {
        alert("Error: " + data.error);
      }
      await handle_roadmap_result();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Request failed";
      alert("Error: " + msg);
    } finally {
      // generation finished – dismiss animation immediately
      setGenerating(false);
      setShowRoadmap(true);
    }
  };

  const handle_roadmap_result = async () => {
    // Simulate fetching roadmaps from backend
      const newRoadmap = await axios.get("http://localhost:8000/roadmap", { withCredentials: true }).then(res => res.data).catch(err => {
      console.error("Failed to fetch roadmaps", err);
      });
      const roadmap_result = {
        roadmap_title: newRoadmap[0].roadmap_title,
        total_duration_weeks: newRoadmap[0].total_duration_weeks,
        phases: [
          ...newRoadmap[0].phases.map(p => ({
            phase_name: p.phase_name,
            focus_area: p.focus_area,
            duration_weeks: p.duration_weeks,
            topics: p.topics.map(t => t.topic_name),
            expected_outcome: p.expected_outcome,
            status: p.status
          }))
        ],
        final_capstone: {
          title: newRoadmap[0].final_capstone.title,
          description: newRoadmap[0].final_capstone.description,
          skills_validated: newRoadmap[0].final_capstone.skills_validated
        }
      };
    const roadmap_box = {
      id: 1, title: newRoadmap[0].roadmap_title,
      target: newRoadmap[0].target, progress: 38, weeks: 24, phase: "Phase 2 · DSA & System Design",
      status: "active", tags: [ `${newRoadmap[0].phases.length} Phases`, `${newRoadmap[0].total_duration_weeks} Weeks`]
    }
    setGeneratedRoadmap(roadmap_result);

    setViewingRoadmap(roadmap_result);
    setRoadmapCard([roadmap_box]);

  };

    useEffect(() => {
    handle_roadmap_result();
    console.log("DEBUG: Fetched roadmap from backend:", roadmapCard);
  }, []);

  // no longer needed; kept for backward compatibility
  const handleGenerateDone = () => {};

    const logout = () => {
    axios.post("http://localhost:8000/logout", {}, { withCredentials: true }).catch(err => {
      console.error("Logout failed", err);
    }).finally(() => {      window.location.href = "/";
    });
  }

  const skills = [
    { label: "Programming", val: 3, color: "#00FFB2" },
    { label: "Databases", val: 3, color: "#7B61FF" },
    { label: "DSA", val: 2, color: "#00FFB2" },
    { label: "System Design", val: 2, color: "#FF4E6A" },
  ];

  return (
    <>
      {/* <style>{css}</style> */}
      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
        <div className="grid-bg" />
        <div className="noise" />

        {/* ── SIDEBAR ── */}
        <SideBar active={activePage} setActivePage={setActivePage} onCreate={() => setShowCreate(true)} />

        {/* ── TOPBAR ── */}
        <TopBar activePage={activePage} logout={logout} />

        {/* ── MAIN CONTENT ── */}
        <main className="main">
          <div className="main-inner">

            {/* ── OVERVIEW PAGE ── */}
            {activePage === "overview" && (
              <>
                {/* Stats */}
                <div className="stat-row">
                  {[
                    { label: "Active Roadmaps", value: "2", suf: "", meta: "↑ 1 this month" },
                    { label: "Completion Rate", value: "38", suf: "%", meta: "Full-Stack SWE" },
                    { label: "Study Streak", value: "7", suf: " days", meta: "Personal best" },
                    { label: "Tasks Done", value: "42", suf: "", meta: "This week: 12" },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}<em>{s.suf}</em></div>
                      <div className="stat-meta">{s.meta}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {/* Skill Overview */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                    <div className="section-header">
                      <div className="section-title-sm">Skill <span>Overview</span></div>
                    </div>
                    <div className="skill-bars">
                      {skills.map(s => (
                        <div key={s.label} className="skill-bar-row">
                          <span className="skill-bar-label">{s.label}</span>
                          <div className="skill-bar-track">
                            <div className="skill-bar-fill" style={{ width: `${(s.val / 5) * 100}%`, background: s.color }} />
                          </div>
                          <span className="skill-bar-val">{s.val}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                    <div className="section-header">
                      <div className="section-title-sm">Recent <span>Activity</span></div>
                    </div>
                    <div className="activity-list">
                      {ACTIVITIES.slice(0, 3).map((a, i) => (
                        <div key={i} className="activity-item">
                          <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                          <div>
                            <div className="activity-text">{a.text}</div>
                            <div className="activity-time">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Roadmaps preview */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                  <div className="section-header">
                    <div className="section-title-sm">Active <span>Roadmaps</span></div>
                    <button onClick={() => setActivePage("roadmaps")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12, cursor: "pointer" }}>
                      View all →
                    </button>
                  </div>
                  <div className="roadmaps-grid">
                    {roadmapCard.filter(r => r.status === "active").slice(0, 2).map(rm => (
                      <div key={rm.id} className="roadmap-card" onClick={() => setViewingRoadmap(generatedRoadmap)}>
                        <div className="roadmap-card-header">
                          <div>
                            {rm.tags.slice(0, 2).map(t => (
                              <span key={t} style={{ fontSize: 10, color: "var(--muted)", marginRight: 8 }}>{t}</span>
                            ))}
                          </div>
                          <span className={`roadmap-status status-${rm.status}`}>{rm.status}</span>
                        </div>
                        <div className="roadmap-title">{rm.title}</div>
                        <div className="roadmap-meta">{rm.phase}</div>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${rm.progress}%` }} />
                        </div>
                        <div className="progress-label">
                          <span>Progress</span><span style={{ color: "var(--accent)" }}>{rm.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── ROADMAPS PAGE ── */}
            {activePage === "roadmaps" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>
                      Your <span style={{ color: "var(--accent)" }}>Roadmaps</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                      {roadmapCard.length} total · {roadmapCard.filter(r => r.status === "active").length} active
                    </div>
                  </div>
                  <button className="btn-next" disabled={!(roadmapCard.length === 0)} onClick={() => setShowCreate(true)} style={{ padding: "10px 22px" }}>
                    <span>+</span> New Roadmap
                  </button>
                </div>

                <div className="roadmaps-grid">
                  {/* Create card */}
                  {roadmapCard.length === 0 && (
                  <div className="create-card" onClick={() => setShowCreate(true)}>
                    <div className="create-icon">+</div>
                    <div className="create-label">Create new roadmap</div>
                    <div className="create-sub">Answer a few questions and let AI build your path</div>
                  </div>
                  )}

                  {roadmapCard.map(rm => (
                    <div key={rm.id} className="roadmap-card" onClick={() => setShowRoadmap(true)}>
                      <div className="roadmap-card-header">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {rm.tags.map(t => (
                            <span key={t} style={{ fontSize: 10, color: "var(--muted)", padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 20 }}>{t}</span>
                          ))}
                        </div>
                        <span className={`roadmap-status status-${rm.status}`}>{rm.status}</span>
                      </div>
                      <div className="roadmap-title">{rm.title}</div>
                      <div className="roadmap-meta">{rm.phase}</div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${rm.progress}%` }} />
                      </div>
                      <div className="progress-label">
                        <span>Progress</span>
                        <span style={{ color: "var(--accent)" }}>{rm.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── OTHER PAGES (placeholder) ── */}
            {["tasks", "progress", "resources"].includes(activePage) && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: "60vh", gap: 16, textAlign: "center" }}>
                <div style={{ fontSize: 48 }}>
                  {{ tasks: "📅", progress: "📈", resources: "📚" }[activePage]}
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>
                  {{ tasks: "Today's Tasks", progress: "Progress Tracker", resources: "Resource Library" }[activePage]}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 320, lineHeight: 1.6 }}>
                  Create a roadmap first — tasks, progress tracking, and resources will appear here once your path is active.
                </div>
                <button className="btn-next" onClick={() => { setActivePage("roadmaps"); setShowCreate(true); }} style={{ padding: "10px 24px" }}>
                  Create a Roadmap →
                </button>
              </div>
            )}

          </div>
        </main>

        {/* ── MODALS ── */}
        {showCreate && !generating && (
          <CreateRoadmapModal onClose={() => setShowCreate(false)} onGenerate={handleGenerate} />
        )}

        {generating && (
          <div className="overlay">
            <div className="form-modal" style={{ maxWidth: 480 }}>
              <GeneratingView onDone={handleGenerateDone} />
            </div>
          </div>
        )}

        {showRoadmap && !generating && (
          <RoadmapViewerModal roadmap={viewingRoadmap} onClose={() => setShowRoadmap(false)} />
        )}
      </div>
    </>
  );
}

