import { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import Footer from "./Footer";
import Modal from "./Modal";


import NavBar from "./NavBar";
const features = [
  {
    icon: "🧠",
    tag: "01 — Core",
    title: "AI-Engineered Paths",
    desc: "Input your goal, current skills, and timeline. Get a structured, phased roadmap built specifically for you — not a recycled template.",
  },
  {
    icon: "📅",
    tag: "02 — Daily",
    title: "Daily Task Engine",
    desc: "Know exactly what to study today. Calibrated to your weekly hours, current phase, and streak — adaptive, not rigid.",
  },
  {
    icon: "📈",
    tag: "03 — Track",
    title: "Progress & Unlocks",
    desc: "Phases unlock as you advance. Streak logic, completion rates, and automatic pacing adjustments keep you moving forward.",
  },
];

const steps = [
  { num: "01", name: "Define your goal", desc: "Target role, current skill level, weekly study hours, and how you learn best." },
  { num: "02", name: "AI builds the path", desc: "Structured phases, objectives, projects, and a capstone — generated in seconds." },
  { num: "03", name: "Execute daily", desc: "Focused tasks each day with curated resources and clear phase milestones." },
  { num: "04", name: "Land the role", desc: "Complete your capstone, validate your skills, ship your outcome." },
];

const marqueeItems = [
  "Personalized Learning", "AI Roadmaps", "Daily Tasks", "Skill Tracking",
  "Adaptive Pacing", "Capstone Projects", "Resource Curation", "Phase Unlocks",
];





export default function LandingPage() {
  const [modal, setModal] = useState(null); // 'login' | 'signup' | null
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const allMarquee = [...marqueeItems, ...marqueeItems];

  return (
    <>
      {/* <style>{styles}</style> */}
      <div className="rmai-root">
        <div className="grid-bg" />
        <div className="noise" />
        <NavBar scrolled={scrolled} setModal={setModal} />

        {/* ── HERO ── */}
        <section className="hero">
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          <div className="badge">
            <span className="badge-dot" />
            AI-Powered Learning Infrastructure
          </div>

          <h1 className="hero-title">
            <span className="word-map">Road</span>
            <span className="word-map">map</span>
            <span className="word-ai"> AI</span>
          </h1>

          <p className="hero-tagline">
            Tell us where you want to go.<br />
            <strong>We engineer the exact path to get you there —</strong><br />
            week by week, skill by skill.
          </p>

          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => setModal("signup")}>
              Build my roadmap
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
          </div>

          <div className="scroll-hint">
            <div className="scroll-line" />
            scroll
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {allMarquee.map((item, i) => (
              <div key={i} className="marquee-item">
                {item}
                <span className="gem">◆</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="section">
          <p className="section-eyebrow">What we offer</p>
          <h2 className="section-title">
            Everything you need.<br /><em>Nothing you don't.</em>
          </h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon-wrap">{f.icon}</div>
                <p className="feat-tag">{f.tag}</p>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="steps-wrap">
          <div className="steps-inner">
            <p className="section-eyebrow">The process</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Four steps.<br /><em>One destination.</em>
            </h2>
            <div className="steps-grid">
              {steps.map((s, i) => (
                <div key={i} className="step-card">
                  <div className="step-num">{s.num}</div>
                  <div className="step-name">{s.name}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ maxWidth: 1100, margin: "100px auto 0", padding: "0 48px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden"
          }}>
            {[
              { num: "10", suf: "x", label: "Faster than manual planning" },
              { num: "∞", suf: "", label: "Unique paths — no templates" },
              { num: "0", suf: "", label: "Generic roadmaps used" },
            ].map((s, i) => (
              <div key={i} className="stat-cell">
                <div className="stat-big">{s.num}<em>{s.suf}</em></div>
                <div className="stat-sub">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BAND ── */}
        <div style={{ padding: "100px 48px 0" }}>
          <div className="cta-band" style={{ borderRadius: 20, margin: "0 0 0 0" }}>
            <h2>Ready to start?</h2>
            <p>Your personalized learning path is one prompt away.</p>
            <div className="cta-band-btns">
              <button className="btn-cta-dark" onClick={() => setModal("signup")}>
                Create free account
              </button>
              <button className="btn-cta-outline" onClick={() => setModal("login")}>
                Log in
              </button>
            </div>
          </div>
        </div>


        {/* ── FOOTER ── */}
        <Footer />
      </div>
      {/* ── MODAL ── */}
      {modal && (
        <Modal
          type={modal}
          onClose={() => setModal(null)}
          onSwitch={setModal}
        />
      )}
    </>
  );
}