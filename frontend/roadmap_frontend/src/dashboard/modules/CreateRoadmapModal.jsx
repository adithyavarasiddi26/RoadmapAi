import { useState } from "react";

// ─── FORM STEPS ───────────────────────────────────────────────────────────────
const STEP_LABELS = ["Goal", "Skills", "Schedule", "Summary"];


export default function CreateRoadmapModal({ onClose, onGenerate }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    goal: "", target_role: "", current_level: "",
    prog_score: 3, db_score: 3, dsa_score: 3, sd_score: 3,
    experience: "", weekly_hours: "", deadline: "",
    learning_style: "", constraints: ""
  });


  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = [
    form.goal && form.target_role && form.current_level && form.experience,
    true,
    form.weekly_hours && form.deadline,
    form.learning_style
  ][step];

  // notify parent that user clicked generate; payload is the form data
  const handleSubmit = () => {
    onGenerate(form);
    onClose();
  }
  // ─── SCORE PICKER ─────────────────────────────────────────────────────────────
function ScorePicker({ label, value, onChange }) {
  return (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <div className="score-dots">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} className={`score-dot-btn${value >= n ? " sel" : ""}`}
            onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
      <span className="score-val">{value}/5</span>
    </div>
  );
}


  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="form-modal-title">Create <span>Roadmap</span></div>
          <div className="form-modal-sub">Answer a few questions to generate your personalized learning path</div>
        </div>

        <div className="form-body">
          {/* Steps indicator */}
          <div className="steps-indicator" style={{ marginBottom: 36 }}>
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="step-dot-wrap">
                <div className={`step-dot${step === i ? " active" : ""}${step > i ? " done" : ""}`} style={{ position: "relative" }}>
                  {step > i ? "✓" : i + 1}
                  <span className="step-label">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`step-line${step > i ? " done" : ""}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── Step 0: Goal ── */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="form-group form-grid single">
                <div className="form-group">
                  <label className="form-label">Your learning goal <span>*</span></label>
                  <textarea className="form-textarea" placeholder="e.g. Become a backend engineer and land a job at a product company within 6 months..."
                    value={form.goal} onChange={e => set("goal", e.target.value)} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Target role <span>*</span></label>
                  <input className="form-input" placeholder="e.g. Senior Backend Engineer" value={form.target_role} onChange={e => set("target_role", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Current level <span>*</span></label>
                  <select className="form-select" value={form.current_level} onChange={e => set("current_level", e.target.value)}>
                    <option value="">Select level</option>
                    <option value="complete_beginner">Complete Beginner</option>
                    <option value="beginner">Beginner (some exposure)</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Work / education experience</label>
                <select className="form-select" value={form.experience} onChange={e => set("experience", e.target.value)}>
                  <option value="">Select experience level</option>
                  <option value="student">Student / No experience</option>
                  <option value="0-1">0–1 year</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Step 1: Skills ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                Rate your current skill level from 1 (beginner) to 5 (expert)
              </p>
              <div className="score-group">
                <ScorePicker label="🖥️  Programming" value={form.prog_score} onChange={v => set("prog_score", v)} />
                <ScorePicker label="🗄️  Databases" value={form.db_score} onChange={v => set("db_score", v)} />
                <ScorePicker label="🧩  DSA" value={form.dsa_score} onChange={v => set("dsa_score", v)} />
                <ScorePicker label="⚙️  System Design" value={form.sd_score} onChange={v => set("sd_score", v)} />
              </div>
              <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(0,255,178,0.05)", border: "1px solid rgba(0,255,178,0.12)", borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  💡 Be honest — lower scores help the AI focus on your weak spots first.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Schedule ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Weekly study hours <span>*</span></label>
                  <select className="form-select" value={form.weekly_hours} onChange={e => set("weekly_hours", e.target.value)}>
                    <option value="">Select hours</option>
                    <option value="5">5 hrs/week (casual)</option>
                    <option value="10">10 hrs/week</option>
                    <option value="15">15 hrs/week</option>
                    <option value="20">20 hrs/week</option>
                    <option value="30">30+ hrs/week (intensive)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline (months) <span>*</span></label>
                  <select className="form-select" value={form.deadline} onChange={e => set("deadline", e.target.value)}>
                    <option value="">Select deadline</option>
                    <option value="8">2 months</option>
                    <option value="12">3 months</option>
                    <option value="24">6 months</option>
                    <option value="36">9 months</option>
                    <option value="48">12 months</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Constraints or special notes</label>
                <textarea className="form-textarea" style={{ minHeight: 80 }}
                  placeholder="e.g. I work full-time, prefer weekends for longer sessions, no paid courses..."
                  value={form.constraints} onChange={e => set("constraints", e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Step 3: Style ── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* <div className="form-group">
                <label className="form-label" style={{ marginBottom: 10 }}>Preferred learning style <span>*</span></label>
                <div className="style-grid">
                  {LEARNING_STYLES.map(s => (
                    <div key={s.label} className={`style-chip${form.learning_style === s.label ? " sel" : ""}`}
                      onClick={() => set("learning_style", s.label)}>
                      <div className="style-chip-icon">{s.icon}</div>
                      <div className="style-chip-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Summary */}
              <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
                <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Summary</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    ["Goal", form.target_role || "—"],
                    ["Level", form.current_level || "—"],
                    ["Hours/week", form.weekly_hours ? `${form.weekly_hours} hrs` : "—"],
                    ["Deadline", form.deadline ? `${form.deadline/4} months` : "—"],
                    ["Skills avg", `${((form.prog_score + form.db_score + form.dsa_score + form.sd_score) / 4).toFixed(1)}/5`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--muted)" }}>{k}</span>
                      <span style={{ color: "var(--text)", fontWeight: 400 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="form-footer">
            <button className="btn-prev" onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}>
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            {step < 3 ? (
              <button className="btn-next" disabled={!canNext} onClick={() => setStep(s => s + 1)}>
                Continue →
              </button>
            ) : (
              <button className="btn-next"  onClick={handleSubmit}>
                <span>✨</span> Generate Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}