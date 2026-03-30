


export default function NavBar( { scrolled, setModal }) {
    return (
        <div>
            {/* ── NAVBAR ── */}
            <nav className="navbar" style={scrolled ? { background: "hsla(0, 0%, 0%, 0.25)" } : {}}>
            <a className="nav-logo">
                <div className="logo-mark">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12 L7 2 L12 12" stroke="#E9C46A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 8.5h6" stroke="#E9C46A" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                </div>
                <span className="logo-text">Roadmap<span>AI</span></span>
            </a>
{/* 
            <div className="nav-center">
                {["Features", "How it works", "Pricing"].map(l => (
                <button key={l} className="nav-link">{l}</button>
                ))}
            </div> */}

            <div className="nav-right">
                <button className="btn-login" onClick={() => setModal("login")}>Log in</button>
                <button className="btn-signup" onClick={() => setModal("signup")}>Sign up free</button>
            </div>
            </nav>
        </div>
    )
}