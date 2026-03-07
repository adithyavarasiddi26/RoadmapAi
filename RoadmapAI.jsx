import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --surface: #0c0c14;
    --border: rgba(255,255,255,0.07);
    --accent: #00FFB2;
    --accent2: #7B61FF;
    --text: #F0EEF8;
    --muted: #6B6880;
    --card: rgba(255,255,255,0.03);
  }

  .rmai-root {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Grid BG ── */
  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,178,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,178,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }
  .grid-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,97,255,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,255,178,0.05) 0%, transparent 50%);
  }

  /* ── Noise ── */
  .noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* ── NAVBAR ── */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 64px;
    border-bottom: 1px solid var(--border);
    background: rgba(5,5,8,0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: background 0.3s;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
  }
  .logo-mark {
    width: 30px; height: 30px;
    border: 1.5px solid var(--accent);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .logo-mark::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,255,178,0.15), transparent);
  }
  .logo-mark svg { position: relative; z-index: 1; }
  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.3px;
    color: var(--text);
  }
  .logo-text span { color: var(--accent); }

  .nav-center {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .nav-link {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.01em;
  }
  .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-login {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    padding: 8px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-login:hover {
    border-color: rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.05);
  }

  .btn-signup {
    background: var(--accent);
    border: none;
    color: #050508;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    letter-spacing: 0.02em;
    box-shadow: 0 0 20px rgba(0,255,178,0.25);
  }
  .btn-signup:hover {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 0 32px rgba(0,255,178,0.38);
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative;
    z-index: 2;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border: 1px solid rgba(0,255,178,0.25);
    border-radius: 100px;
    background: rgba(0,255,178,0.05);
    font-size: 11.5px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 36px;
    animation: fadeDown 0.7s ease both;
  }
  .badge-dot {
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: blink 1.8s infinite;
  }
  @keyframes blink {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(52px, 9vw, 110px);
    line-height: 0.95;
    letter-spacing: -3px;
    margin-bottom: 0;
    animation: fadeDown 0.8s 0.1s ease both;
  }
  .hero-title .word-map {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(255,255,255,0.5);
    position: relative;
    display: inline-block;
  }
  .hero-title .word-ai {
    color: var(--accent);
    text-shadow: 0 0 60px rgba(0,255,178,0.4);
    display: inline-block;
    position: relative;
  }
  .hero-title .word-ai::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent);
    animation: lineSlide 1s 0.9s ease both;
    transform-origin: left;
    transform: scaleX(0);
  }
  @keyframes lineSlide {
    to { transform: scaleX(1); }
  }

  .hero-tagline {
    font-family: 'DM Sans', sans-serif;
    font-style: italic;
    font-size: clamp(17px, 2.2vw, 22px);
    font-weight: 300;
    color: var(--muted);
    margin-top: 28px;
    max-width: 520px;
    line-height: 1.55;
    animation: fadeDown 0.9s 0.25s ease both;
  }
  .hero-tagline strong {
    color: rgba(240,238,248,0.75);
    font-weight: 400;
    font-style: normal;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 52px;
    animation: fadeDown 0.9s 0.4s ease both;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-hero-primary {
    background: var(--accent);
    border: none;
    color: #050508;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 14px 36px;
    border-radius: 10px;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 0 40px rgba(0,255,178,0.3);
    letter-spacing: 0.01em;
  }
  .btn-hero-primary:hover {
    opacity: 0.88;
    transform: translateY(-2px);
    box-shadow: 0 0 60px rgba(0,255,178,0.45);
  }

  .btn-hero-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 14px 32px;
    border-radius: 10px;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .btn-hero-ghost:hover {
    border-color: rgba(255,255,255,0.18);
    color: var(--text);
    background: rgba(255,255,255,0.04);
  }

  /* ── Glow orbs ── */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(123,97,255,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
  }
  .orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,255,178,0.08) 0%, transparent 70%);
    bottom: 0; right: -50px;
  }

  /* ── Scroll indicator ── */
  .scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    animation: fadeDown 1s 0.8s ease both;
  }
  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollPulse 2s infinite;
  }
  @keyframes scrollPulse {
    0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
    50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
    100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
  }

  /* ── MARQUEE ── */
  .marquee-wrap {
    position: relative; z-index: 2;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    padding: 16px 0;
    background: var(--surface);
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: slide 28s linear infinite;
  }
  .marquee-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 36px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .marquee-item .gem {
    color: var(--accent);
    font-size: 14px;
  }
  @keyframes slide {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ── FEATURES ── */
  .section {
    position: relative;
    z-index: 2;
    padding: 100px 48px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
  }
  .section-eyebrow::before {
    content: '';
    width: 24px; height: 1px;
    background: var(--accent);
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -1.5px;
    margin-bottom: 60px;
    max-width: 480px;
  }
  .section-title em {
    font-style: italic;
    color: var(--accent);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .feat-card {
    background: var(--surface);
    padding: 40px 32px;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .feat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .feat-card:hover { background: rgba(0,255,178,0.03); }
  .feat-card:hover::before { opacity: 1; }

  .feat-icon-wrap {
    width: 46px; height: 46px;
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    margin-bottom: 28px;
    background: var(--card);
    transition: border-color 0.3s;
  }
  .feat-card:hover .feat-icon-wrap {
    border-color: rgba(0,255,178,0.3);
  }
  .feat-tag {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .feat-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }
  .feat-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }

  /* ── STEPS ── */
  .steps-wrap {
    position: relative; z-index: 2;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 100px 48px;
  }
  .steps-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-top: 60px;
  }
  .step-card {
    padding: 36px 28px;
    background: var(--bg);
    position: relative;
  }
  .step-card:first-child {
    background: linear-gradient(135deg, rgba(0,255,178,0.08), rgba(123,97,255,0.05));
    border: 1px solid rgba(0,255,178,0.15);
    border-radius: 4px;
  }
  .step-num {
    font-family: 'Syne', sans-serif;
    font-size: 48px;
    font-weight: 800;
    line-height: 1;
    color: rgba(255,255,255,0.06);
    margin-bottom: 24px;
    letter-spacing: -2px;
  }
  .step-card:first-child .step-num { color: var(--accent); opacity: 0.6; }
  .step-name {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }
  .step-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.65;
  }

  /* ── STATS ── */
  .stats-wrap {
    position: relative; z-index: 2;
    padding: 80px 48px;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 0;
    margin-bottom: 100px;
    /* override centering for this one */
    max-width: 1004px;
  }
  .stat-cell {
    background: var(--surface);
    padding: 48px 40px;
    text-align: center;
  }
  .stat-big {
    font-family: 'Syne', sans-serif;
    font-size: 64px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -3px;
    color: var(--text);
  }
  .stat-big em {
    color: var(--accent);
    font-style: normal;
  }
  .stat-sub {
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 12px;
  }

  /* ── CTA ── */
  .cta-band {
    position: relative; z-index: 2;
    background: var(--accent);
    padding: 80px 48px;
    text-align: center;
    overflow: hidden;
  }
  .cta-band::before {
    content: 'ROADMAP';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: 'Syne', sans-serif;
    font-size: 220px;
    font-weight: 800;
    color: rgba(5,5,8,0.07);
    white-space: nowrap;
    pointer-events: none;
    line-height: 1;
  }
  .cta-band h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 800;
    color: #050508;
    letter-spacing: -2px;
    line-height: 0.95;
    margin-bottom: 20px;
    position: relative;
  }
  .cta-band p {
    font-size: 17px;
    color: rgba(5,5,8,0.65);
    max-width: 400px;
    margin: 0 auto 40px;
    font-style: italic;
    position: relative;
  }
  .cta-band-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    flex-wrap: wrap;
  }
  .btn-cta-dark {
    background: #050508;
    border: none;
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 14px 40px;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.02em;
  }
  .btn-cta-dark:hover { opacity: 0.85; transform: translateY(-2px); }
  .btn-cta-outline {
    background: transparent;
    border: 1.5px solid rgba(5,5,8,0.25);
    color: #050508;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 13px 32px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-cta-outline:hover { background: rgba(5,5,8,0.08); }

  /* ── FOOTER ── */
  footer {
    position: relative; z-index: 2;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: var(--text);
    letter-spacing: -0.2px;
  }
  .footer-logo span { color: var(--accent); }
  .footer-copy { font-size: 12px; color: var(--muted); }
  .footer-links {
    display: flex; gap: 24px; list-style: none;
  }
  .footer-links button {
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: var(--muted);
    cursor: pointer; transition: color 0.2s;
  }
  .footer-links button:hover { color: var(--text); }

  /* ── MODAL ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5,5,8,0.85);
    backdrop-filter: blur(12px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px 44px;
    width: 100%;
    max-width: 420px;
    position: relative;
    animation: slideUp 0.3s ease;
  }
  .modal-close {
    position: absolute;
    top: 16px; right: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--muted);
    width: 32px; height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }
  .modal-logo {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 32px;
  }
  .modal-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 16px;
  }
  .modal-logo-text span { color: var(--accent); }
  .modal h2 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .modal-sub {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 32px;
    line-height: 1.5;
  }
  .modal-sub a {
    color: var(--accent);
    cursor: pointer;
    text-decoration: none;
    font-weight: 400;
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(240,238,248,0.6);
    letter-spacing: 0.06em;
    display: block;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus {
    border-color: rgba(0,255,178,0.4);
    background: rgba(0,255,178,0.03);
  }
  .form-submit {
    width: 100%;
    background: var(--accent);
    border: none;
    color: #050508;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 14px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 0 30px rgba(0,255,178,0.25);
    letter-spacing: 0.02em;
  }
  .form-submit:hover { opacity: 0.88; transform: translateY(-1px); }
  .modal-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0;
  }
  .modal-divider::before, .modal-divider::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border);
  }
  .modal-divider span { font-size: 11px; color: var(--muted); letter-spacing: 0.1em; }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 768px) {
    .navbar { padding: 0 20px; }
    .nav-center { display: none; }
    .hero { padding: 100px 20px 80px; }
    .section { padding: 80px 20px; }
    .features-grid { grid-template-columns: 1fr; }
    .steps-grid { grid-template-columns: 1fr 1fr; }
    .stats-wrap { grid-template-columns: 1fr; margin: 0 20px 80px; }
    .steps-wrap { padding: 80px 20px; }
    .cta-band { padding: 60px 20px; }
    footer { padding: 24px 20px; flex-direction: column; gap: 12px; }
    .modal { padding: 36px 24px; margin: 16px; }
  }
`;

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

function Modal({ type, onClose, onSwitch }) {
  const isLogin = type === "login";
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">
          <div style={{
            width: 26, height: 26, border: "1.5px solid #00FFB2",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,255,178,0.1)"
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10 L6 2 L10 10" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 7h5" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="modal-logo-text">Roadmap<span>AI</span></span>
        </div>

        <h2>{isLogin ? "Welcome back" : "Get started free"}</h2>
        <p className="modal-sub">
          {isLogin
            ? <>Don't have an account? <a onClick={() => onSwitch("signup")}>Sign up →</a></>
            : <>Already have an account? <a onClick={() => onSwitch("login")}>Log in →</a></>
          }
        </p>

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" type="text" placeholder="Alex Johnson" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" />
        </div>
        <button className="form-submit">{isLogin ? "Log in to RoadmapAI" : "Create my account"}</button>

        <div className="modal-divider"><span>or continue with</span></div>
        <button style={{
          width: "100%", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "12px",
          color: "#F0EEF8", fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10,
          transition: "background 0.2s"
        }}
          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.04)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default function App() {
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
      <style>{styles}</style>
      <div className="rmai-root">
        <div className="grid-bg" />
        <div className="noise" />

        {/* ── NAVBAR ── */}
        <nav className="navbar" style={scrolled ? { background: "rgba(5,5,8,0.95)" } : {}}>
          <a className="nav-logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12 L7 2 L12 12" stroke="#00FFB2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 8.5h6" stroke="#00FFB2" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">Roadmap<span>AI</span></span>
          </a>

          <div className="nav-center">
            {["Features", "How it works", "Pricing"].map(l => (
              <button key={l} className="nav-link">{l}</button>
            ))}
          </div>

          <div className="nav-right">
            <button className="btn-login" onClick={() => setModal("login")}>Log in</button>
            <button className="btn-signup" onClick={() => setModal("signup")}>Sign up free</button>
          </div>
        </nav>

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
            <button className="btn-hero-ghost">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M6 5.5l4 2-4 2V5.5z" fill="currentColor"/>
              </svg>
              See how it works
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
        <footer style={{ marginTop: 100 }}>
          <div className="footer-logo">RoadmapAI<span>.</span></div>
          <span className="footer-copy">© 2025 RoadmapAI · All rights reserved</span>
          <ul className="footer-links">
            {["Privacy", "Terms", "Contact"].map(l => (
              <li key={l}><button>{l}</button></li>
            ))}
          </ul>
        </footer>
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
