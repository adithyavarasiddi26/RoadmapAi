import "./Dashboard.css";
import { useState, useEffect } from "react";
import TopBar from "./modules/TopBar";
import SideBar from "./modules/SideBar";
import { Outlet } from "react-router-dom";

import axios from "axios";
import DailyTasks from "./modules/DailyTasks";
import Roadmap from "./modules/Roadmap";

    // ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ROADMAPS = [
  // {
  //   id: 1, title: "Full-Stack SWE at Google",
  //   target: "Senior SWE", progress: 38, weeks: 24, phase: "Phase 2 · DSA & System Design",
  //   status: "active", tags: ["6 Phases", "24 Weeks", "Advanced"]
  // },
  // {
  //   id: 2, title: "ML Engineer Transition",
  //   target: "ML Engineer", progress: 12, weeks: 32, phase: "Phase 1 · Python & Math",
  //   status: "active", tags: ["8 Phases", "32 Weeks", "Intermediate"]
  // },
  // {
  //   id: 3, title: "Frontend React Specialist",
  //   target: "Frontend Lead", progress: 0, weeks: 16, phase: "Not started",
  //   status: "draft", tags: ["4 Phases", "16 Weeks", "Intermediate"]
  // }
];

const ACTIVITIES = [

  { icon: "✅", bg: "rgba(0,255,178,0.1)", text: "Completed Phase 1 of Full-Stack SWE roadmap", time: "2 hours ago" },
  { icon: "🎯", bg: "rgba(123,97,255,0.1)", text: "Unlocked Phase 2 — DSA & System Design", time: "2 hours ago" },
  { icon: "📚", bg: "rgba(255,255,255,0.06)", text: "Added resource: CS50 Problem Sets", time: "Yesterday" },
  { icon: "🔥", bg: "rgba(255,78,106,0.1)", text: "7-day streak achieved! Keep it up", time: "Yesterday" },
];

const MOCK_ROADMAP_RESULT = {
  roadmap_title: "Full-Stack SWE Mastery Path",
  total_duration_weeks: 24,
  phases: [
    {
      phase_name: "Foundations & Core CS",
      focus_area: "Programming & Computer Science Basics",
      duration_weeks: 4,
      topics: ["Data Types & OOP", "Complexity Analysis", "Recursion", "Git & Linux Basics"],
      expected_outcome: "Solid programming foundation ready for advanced data structures.",
      status: "done"
    },
    {
      phase_name: "Data Structures & Algorithms",
      focus_area: "DSA Mastery",
      duration_weeks: 6,
      topics: ["Arrays & Strings", "Trees & Graphs", "DP Patterns", "Sorting & Searching", "LeetCode 75"],
      expected_outcome: "Solve medium-hard DSA problems confidently under time pressure.",
      status: "active"
    },
    {
      phase_name: "System Design & Architecture",
      focus_area: "Scalable Systems",
      duration_weeks: 5,
      topics: ["Distributed Systems", "Database Design", "Caching & CDN", "Load Balancing", "API Design"],
      expected_outcome: "Design scalable systems for 10M+ user products with confidence.",
      status: "locked"
    },
    {
      phase_name: "Full-Stack Development",
      focus_area: "Frontend + Backend",
      duration_weeks: 5,
      topics: ["React & Next.js", "Node.js & Express", "PostgreSQL", "REST & GraphQL", "Auth & Security"],
      expected_outcome: "Build and ship production-grade full-stack applications end-to-end.",
      status: "locked"
    },
    {
      phase_name: "Interview Preparation",
      focus_area: "Behavioral + Technical",
      duration_weeks: 4,
      topics: ["STAR Method", "Mock Interviews", "System Design Practice", "Offer Negotiation"],
      expected_outcome: "Crack technical interviews at top-tier companies with confidence.",
      status: "locked"
    },
  ],
  final_capstone: {
    title: "SaaS Platform End-to-End Build",
    description: "Design and build a full-stack SaaS application handling 10k concurrent users, with a React frontend, Node.js backend, PostgreSQL database, Redis caching, and complete CI/CD pipeline.",
    skills_validated: ["System Design", "DSA Application", "Full-Stack Engineering", "DevOps Basics", "Product Thinking"]
  }
};








//generate view while waiting for roadmap generation to complete



// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function Dashboard({ logout }) {
  const [activePage, setActivePage] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [viewingRoadmap, setViewingRoadmap] = useState(null);
  const [roadmapCard, setRoadmapCard] = useState([]);
  
  const [overviewData , setOverviewData] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);





 


  //   useEffect(() => {
  //   handle_roadmap_result();
  //   get_overview_data();
  //   get_recently_completed_tasks()
  //   console.log("DEBUG: Fetched roadmap from backend:", roadmapCard);
  // }, []);

  // no longer needed; kept for backward compatibility
  

    

  const skills = [
    { label: "Programming", val: 3, color: "#00FFB2" },
    { label: "Databases", val: 3, color: "#7B61FF" },
    { label: "DSA", val: 2, color: "#00FFB2" },
    { label: "System Design", val: 2, color: "#FF4E6A" },
  ];

  return (
    <>
      {/* <style>{css}</style> */}
      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
        <div className="grid-bg" />
        <div className="noise" />

        {/* ── SIDEBAR ── */}
        <SideBar active={activePage} setActivePage={setActivePage} onCreate={() => setShowCreate(true)} />

        {/* ── TOPBAR ── */}
        

        {/* ── MAIN CONTENT ── */}
        <main className="main">
          <div className="main-inner">

            {/* ── OVERVIEW PAGE ──
            {activePage === "overview" && (
              
            )} */}

            {/* ── ROADMAPS PAGE ── */}
            {/* {activePage === "roadmaps" && (
              <Roadmap  />
            )} */}
            <Outlet context={{ logout }} />

            {/* ── OTHER PAGES (placeholder) ── */}
            {/* {["tasks"].includes(activePage) && (
              // <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              //   minHeight: "60vh", gap: 16, textAlign: "center" }}>
              //   <div style={{ fontSize: 48 }}>
              //     {{ tasks: "📅", progress: "📈", resources: "📚" }[activePage]}
              //   </div>
              //   <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>
              //     {{ tasks: "Today's Tasks", progress: "Progress Tracker", resources: "Resource Library" }[activePage]}
              //   </div>
              //   <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 320, lineHeight: 1.6 }}>
              //     Create a roadmap first — tasks, progress tracking, and resources will appear here once your path is active.
              //   </div>
              //   <button className="btn-next" onClick={() => { setActivePage("roadmaps"); setShowCreate(true); }} style={{ padding: "10px 24px" }}>
              //     Create a Roadmap →
              //   </button>

              // </div>
              < DailyTasks overviewData={overviewData} />
            )} */}

          </div>
        </main>

        {/* ── MODALS ── */}
        {/* {showCreate && !generating && (
          <CreateRoadmapModal onClose={() => setShowCreate(false)} onGenerate={handleGenerate} />
        )}

        {generating && (
          <div className="overlay">
            <div className="form-modal" style={{ maxWidth: 480 }}>
              <GeneratingView onDone={handleGenerateDone} />
            </div>
          </div>
        )}

        {showRoadmap && !generating && (
          <RoadmapViewerModal roadmap={viewingRoadmap} onClose={() => setShowRoadmap(false)} />
        )} */}
      </div>
    </>
  );
}

