import { useState, useEffect } from "react";
// ─── GENERATING SCREEN ────────────────────────────────────────────────────────
export default function GeneratingView({ onDone }) {



  return (
    <div className="generating">
      <div className="gen-spinner" />
      <div className="gen-title">Generating your roadmap<span style={{ color: "var(--accent)" }}>...</span></div>
      <div className="gen-sub">Our AI is building a personalized path based on your inputs.</div>
    </div>
  );
}