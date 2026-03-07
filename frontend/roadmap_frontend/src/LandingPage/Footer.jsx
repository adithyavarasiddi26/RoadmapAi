


export default function Footer() {
    return (
        <div>
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
    )
}