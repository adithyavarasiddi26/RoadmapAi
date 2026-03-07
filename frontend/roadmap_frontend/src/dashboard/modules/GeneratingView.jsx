import { useState, useEffect } from "react";
// ─── GENERATING SCREEN ────────────────────────────────────────────────────────
export default function GeneratingView({ onDone }) {
  const [gstep, setGstep] = useState(0);
  const steps = [
    "Analyzing your skill profile...",
    "Identifying knowledge gaps...",
    "Structuring learning phases...",
    "Curating topics & projects...",
    "Finalizing your roadmap...",
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setGstep(i + 1), (i + 1) * 800)
    );
    const done = setTimeout(onDone, steps.length * 800 + 600);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <div className="generating">
      <div className="gen-spinner" />
      <div className="gen-title">Generating your roadmap<span style={{ color: "var(--accent)" }}>...</span></div>
      <div className="gen-sub">Our AI is building a personalized path based on your inputs.</div>
      <div className="gen-steps">
        {steps.map((s, i) => (
          <div key={i} className={`gen-step${gstep > i ? " done" : gstep === i ? " active" : ""}`}>
            <div className="gen-step-dot" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}