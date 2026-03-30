


// ─── ROADMAP VIEWER MODAL ──────────────────────────────────────────────────────
export default function RoadmapViewerModal({ roadmap, onClose, handleDeleteRoadmap }) {
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