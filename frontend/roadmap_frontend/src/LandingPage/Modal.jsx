import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Modal({ type, onClose, onSwitch }) {
  const isLogin = type === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function onclose() {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    onClose();
  }

  function HandleLogIn(e) {
    e.preventDefault();
    // clear previous errors
    setError("");
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    console.log("Submitting form with values:", { name, email, password });
    const endpoint = isLogin ? "/login" : "/signup";
    const response = axios.post(`http://localhost:8000${endpoint}`, {
      name: name,
      email: email,
      password: password
    },{withCredentials: true}).catch(err => {
      // show network/server error
      const msg = err.response?.data?.detail || err.message || "Request failed";
      setError(msg);
    });
    response.then(res => {
      const data = res.data;
      console.log("Received response:", data);
      if (data.error) {
        setError(data.error);
      } else {
        // success, close modal and maybe refresh page or update user state
        onClose();
        alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
        // Optionally, you can trigger a page refresh or update the user context here
        // For example: window.location.reload();
        window.location.reload();
      }
    });

  }




  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">
          <div style={{
            width: 26, height: 26, border: "1.5px solid #E9C46A",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,255,178,0.1)"
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10 L6 2 L10 10" stroke="#E9C46A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 7h5" stroke="#E9C46A" strokeWidth="1.5" strokeLinecap="round"/>
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
        {error && (
          <div className="form-error" style={{ color: "#ff4d4f", marginBottom: 10 }}>
            {error}
          </div>
        )}
        <form style={{ marginTop: 30 }} onSubmit={e => { e.preventDefault(); HandleLogIn(e); }}>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" type="text" placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="form-submit" >{isLogin ? "Log in to RoadmapAI" : "Create my account"}</button>

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
          onClick={() => {
            // Redirect to backend route that initiates Google OAuth flow
            window.location.href = "http://localhost:8000/auth/google";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        </form>
      </div>
    </div>
  );
}
