import { useState, useEffect, use } from "react";
import axios from "axios";
import "./DailyTasks.css";
import TopBar from "./TopBar";
import { useOutletContext } from 'react-router-dom';

const initialTasks = [
  {
    id: 1,
    title: "Code Review",
    description: "Review open pull requests in the main repository and leave inline comments on logic issues, naming conventions, and test coverage gaps.",
    duration: 45,
    category: "Development",
    icon: "⌥",
    priority: "high",
  },
  {
    id: 2,
    title: "Standup Sync",
    description: "Join the daily standup call. Share yesterday's progress, today's plan, and any blockers. Keep it under 3 minutes per person.",
    duration: 15,
    category: "Meeting",
    icon: "◈",
    priority: "medium",
  },
  {
    id: 3,
    title: "Update Documentation",
    description: "Add JSDoc comments to the newly shipped API endpoints and update the README with the latest environment variables and setup steps.",
    duration: 30,
    category: "Documentation",
    icon: "§",
    priority: "medium",
  },
  {
    id: 4,
    title: "Fix Critical Bug",
    description: "Investigate the null pointer exception reported in issue #847. Reproduce locally, patch the affected service, and open a PR with a regression test.",
    duration: 90,
    category: "Development",
    icon: "⚠",
    priority: "high",
  },
  {
    id: 5,
    title: "Deploy to Staging",
    description: "Run the CI/CD pipeline for the v2.3.1 release branch, verify all checks pass, and promote the build to the staging environment for QA sign-off.",
    duration: 20,
    category: "DevOps",
    icon: "↑",
    priority: "low",
  },
  {
    id: 6,
    title: "Security Audit",
    description: "Run Dependabot alerts review, check for any critical CVEs in dependencies, and triage the top 5 findings with recommended remediation steps.",
    duration: 60,
    category: "Security",
    icon: "⊛",
    priority: "high",
  },
];

const categoryColors = {
  Development: "#238636",
  Meeting: "#1f6feb",
  Documentation: "#9e6a03",
  DevOps: "#8957e5",
  Security: "#da3633",
};

const priorityLabel = {
  high: { label: "High", color: "#da3633" },
  medium: { label: "Med", color: "#9e6a03" },
  low: { label: "Low", color: "#57ab5a" },
};

function formatDuration(mins) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function CheckIcon({ checked }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {checked ? (
        <>
          <circle cx="8" cy="8" r="7.5" fill="#238636" stroke="#2ea043" />
          <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <circle cx="8" cy="8" r="7.5" fill="transparent" stroke="#30363d" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default function DailyTasks(overviewData) {

  const [submitted, setSubmitted] = useState(false);
  const [submitAnim, setSubmitAnim] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);


  const toggleTask = (id) => {
    if (submitted) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/daily_tasks", {
        withCredentials: true
      });
      console.log("API response for daily tasks:", response.data);
      setTaskDetails(response.data);
      setTasks(response.data);
        
    } catch (error) {
      console.error(error);
    }
  };

  const get_current_data = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/current_data", {
        withCredentials: true
      });
      console.log("API response for current data:", response.data);
      setCurrentData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  fetchTasks();
  get_current_data();
}, []);

useEffect(() => {
  if (submitted) {
    setFadeOut(false);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true); // start fading
    }, 2500); // start fade before disappearing

    const removeTimer = setTimeout(() => {
      setSubmitted(false); // remove from DOM
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }
}, [submitted]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const allDone = completedCount === totalCount;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const totalMins = tasks.reduce((a, t) => a + t.duration, 0);
  const remainingMins = tasks.filter(t => !t.completed).reduce((a, t) => a + t.duration, 0);
  

  const handleSubmit = async () => {
    if (!allDone || submitted) return;
    setSubmitAnim(true);
    setLoading(true);
    const pieces = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#238636", "#2ea043", "#1f6feb", "#8957e5", "#57ab5a"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
      size: 4 + Math.random() * 6,
    }));
    try {
      const response = await axios.post(
        "http://localhost:8000/api/submit_tasks",
        { tasks: tasks.map(t => ({ id: t.id, completed: t.completed })) },
        { withCredentials: true }
      );
      console.log("Submit response:", response);
      // Optionally, you can display a message from response.data here
      setConfetti(pieces);
      setTimeout(() => setSubmitted(true), 600);
      setTimeout(() => setConfetti([]), 2500);
      fetchTasks(); // Refresh tasks after submission
    } catch (error) {
      console.error("Submit error:", error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const { logout } = useOutletContext() || {};

  return (
    <>
    <TopBar activePage={"tasks"} logout={logout} />
    
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      fontFamily: "'Söhne Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      color: "#e6edf3",
      padding: "0",
      position: "relative",
      overflow: "hidden",
      borderRadius: "20px",
    }}>
      {console.log("Fetched daily tasks:", taskDetails)}
      

      {/* Confetti */}
      {/* {confetti.map(p => (
        <div key={p.id} style={{
          position: "fixed",
          left: `${p.x}%`,
          top: "-10px",
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall ${1.5 + p.delay}s ease-in ${p.delay}s forwards`,
          zIndex: 9999,
          pointerEvents: "none",
        }} />
      ))} */}

      {/* Top nav bar */}
      {/* <div style={{
        background: "#161b22",
        borderBottom: "1px solid #21262d",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg width="28" height="28" viewBox="0 0 16 16" fill="#e6edf3">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <div style={{ display: "flex", gap: "0", }}>
            {["Overview", "Repositories", "Projects", "Daily Tasks", "Settings"].map((tab, i) => (
              <div key={tab} style={{
                padding: "0 16px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                color: tab === "Daily Tasks" ? "#e6edf3" : "#848d97",
                borderBottom: tab === "Daily Tasks" ? "2px solid #f78166" : "2px solid transparent",
                cursor: "pointer",
                fontWeight: tab === "Daily Tasks" ? "600" : "400",
                transition: "color 0.15s",
              }}>{tab}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #8957e5, #238636)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#fff",
            border: "2px solid #30363d",
          }}>U</div>
        </div>
      </div> */}

      {/* Main content */}
      {loading ? (
        <div className="generating">
          <div className="gen-spinner" />
          <div className="gen-title">Generating new tasks<span style={{ color: "var(--accent)" }}>...</span></div>
          <div className="gen-sub">Our AI is building daily tasks for you.</div>
        </div>
      ) : (
        taskDetails?.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>
            No tasks found for today. Please check back later!
          </div>
        ) : (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 10px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "30px", color: "#E9C46A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 800 }}>
              ◈ Daily Tasks
            </div>
            <div style={{ fontSize: "17px", color: "#bc6161", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 800 }}>
              {console.log("Current data for header:", currentData)}
              Phase : {currentData ? currentData.current_phase : "Loading..."}
            </div>
            <div style={{ fontSize: "17px", color: "#bc6161", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", fontWeight: 600 }}>
              Topic : {currentData ? currentData.current_topic : "Loading..."}
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e6edf3", lineHeight: 1.2 }}>
              Today's Checklist
            </h1>
            <p style={{ fontSize: "12px", color: "#848d97", marginTop: "4px" }}>{today}</p>
          </div>

          {/* Circular progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#848d97", marginBottom: "2px" }}>Completed</div>
              <div style={{ fontSize: "30px", fontWeight: 700, color: allDone ? "#ebd01f" : "#e6edf3" }}>
                {completedCount}<span style={{ fontSize: "30px", color: "#484f58" }}>/{totalCount}</span>
              </div>
            </div>
            <svg width="100" height="100" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#2b2d21" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={allDone ? "#2ea043" : "#ebd01f"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="213.6"
                strokeDashoffset={213.6 - (213.6 * completedCount / totalCount)}
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
              />
              <text x="40" y="45" textAnchor="middle" fill={allDone ? "#ebd01f" : "#e6edf3"} fontSize="15" fontWeight="700" fontFamily="monospace">
                {progressPct}%
              </text>
            </svg>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}>
          {[
            { label: "Total Time", value: formatDuration(totalMins), color: "#848d97" },
            { label: "Remaining", value: formatDuration(remainingMins), color: allDone ? "#57ab5a" : "#ebd01f" },
            { label: "Time Saved", value: formatDuration(totalMins - remainingMins), color: "#57ab5a" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "6px",
              padding: "14px 16px",
            }}>
              <div style={{ fontSize: "13px", color: "#848d97", marginBottom: "4px", letterSpacing: "0.05em" }}>{stat.label}</div>
              <div style={{ fontSize: "25px", fontWeight: 800, color: stat.color, fontVariantNumeric: "tabular-nums" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#848d97" }}>Progress</span>
            <span style={{ fontSize: "11px", color: "#848d97" }}>{completedCount} of {totalCount} tasks</span>
          </div>
          <div style={{ height: "6px", background: "#21262d", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progressPct}%`,
              background: allDone ? "linear-gradient(90deg, #238636, #2ea043)" : "linear-gradient(90deg, #ebd01f, #ebd01f)",
              borderRadius: "3px",
              transition: "width 0.4s ease, background 0.3s ease",
            }} />
          </div>
        </div>

        {/* Submitted state */}
        {submitted && (
          <div style={{
            background: "#0f2a1a",
            border: "1px solid #2ea043",
            borderRadius: "8px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            animation: "slideIn 0.4s ease",
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}>
            <div style={{ fontSize: "24px" }}>✓</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#57ab5a", marginBottom: "2px" }}>
                All tasks completed & submitted
              </div>
              <div style={{ fontSize: "12px", color: "#848d97" }}>
                Great work! You've finished all {totalCount} tasks for today — {formatDuration(totalMins)} of productive work logged.
              </div>
            </div>
          </div>
        )}

        {/* Task list */}
        <div style={{ marginBottom: "24px" }}>
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`task-row ${task.completed ? "completed" : ""} ${!task.completed ? task.priority : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => toggleTask(task.id)}
              onMouseEnter={() => setHoveredId(task.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Check button */}
              <div className="check-btn">
                <CheckIcon checked={task.completed} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: task.completed ? "#484f58" : "#e6edf3",
                    textDecoration: task.completed ? "line-through" : "none",
                    transition: "color 0.2s, text-decoration 0.2s",
                  }}>
                    {task.title}
                  </span>
                  <span className="tag" style={{
                    color: categoryColors[task.category] || "#848d97",
                    borderColor: (categoryColors[task.category] || "#848d97") + "44",
                    background: (categoryColors[task.category] || "#848d97") + "11",
                    fontSize: "10px",
                  }}>
                    {task.category}
                  </span>
                  <span className="tag" style={{
                    color: task.completed ? "#484f58" : (priorityLabel[task.priority]?.color || "#848d97"),
                    borderColor: (task.completed ? "#21262d" : priorityLabel[task.priority]?.color + "44" || "#848d97"),
                    background: "transparent",
                    fontSize: "13px",
                  }}>
                    {priorityLabel[task.priority]?.label}
                  </span>
                </div>
                <p style={{
                  fontSize: "17px",
                  color: task.completed ? "#3d444d" : "#848d97",
                  lineHeight: "1.6",
                  transition: "color 0.2s",
                }}>
                  {task.description}
                </p>
              </div>

              {/* Right: duration + icon */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  color: task.completed ? "#3d444d" : "#848d97",
                  fontSize: "12px",
                  fontVariantNumeric: "tabular-nums",
                  transition: "color 0.2s",
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 4a.75.75 0 01.75.75v3.69l2.28 1.52a.75.75 0 01-.83 1.25l-2.5-1.667A.75.75 0 017.25 9V4.75A.75.75 0 018 4z"/>
                  </svg>
                  {formatDuration(task.duration)}
                </div>
                {task.completed && (
                  <div style={{
                    fontSize: "10px",
                    color: "#57ab5a",
                    letterSpacing: "0.05em",
                    animation: "slideIn 0.2s ease",
                  }}>done</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / submit row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: "6px",
        }}>
          <div style={{ fontSize: "12px", color: "#848d97" }}>
            {allDone
              ? submitted ? "✓ Submitted for today" : "All tasks complete — ready to submit"
              : `${totalCount - completedCount} task${totalCount - completedCount !== 1 ? "s" : ""} remaining`
            }
          </div>
          <button
            className={`submit-btn ${allDone ? `active${submitAnim ? " anim" : ""}` : "disabled"}`}
            onClick={handleSubmit}
            disabled={!allDone || submitted}
          >
            
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.75 4.75v4.69l2.28 1.52a.75.75 0 01-.83 1.25l-2.5-1.667A.75.75 0 017.25 9.5v-4.75a.75.75 0 011.5 0z"/>
                </svg>
                Submit Day
              </>
            
          </button>
        </div>
      </div>))}
    </div>
    </>
    
  );
}