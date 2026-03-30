import {useState, useEffect} from "react";
import RoadmapViewerModal from "./RoadmapViewerModal";
import CreateRoadmapModal from "./CreateRoadmapModal";
import GeneratingView from "./GeneratingView";
import axios from "axios";
import TopBar from "./TopBar";

export default function Roadmap() {
    const [showCreate, setShowCreate] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [viewingRoadmap, setViewingRoadmap] = useState(null);
    const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
    const [roadmapCard, setRoadmapCard] = useState([]);
    const handleGenerate = async (formData) => {
    setShowCreate(false);
    setGenerating(true);
    try {
      const res = await axios.post("http://localhost:8000/generate_roadmap", formData, { withCredentials: true });
      const data = res.data;
      if (data.error) {
        alert("Error: " + data.error);
      }
      await handle_roadmap_result();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Request failed";
      alert("Error: " + msg);
    } finally {
      // generation finished – dismiss animation immediately
      setGenerating(false);
      setShowRoadmap(true);
    }
    };

    const handleDeleteRoadmap = async () => {
    // Implement roadmap deletion logic here
    if (!window.confirm("Are you sure you want to delete this roadmap? This action cannot be undone.")) {
      return;
    }
    const response = await axios.delete("http://localhost:8000/roadmap", { withCredentials: true }).then(res => res.data).catch(err => {
        console.error("Failed to delete roadmap", err);
        alert("Failed to delete roadmap. Please try again.");
    });
    if (response && !response.error) {
        alert("Roadmap deleted successfully.");
        window.location.reload(); // Refresh to update the UI
    }
    }

  


    const handle_roadmap_result = async () => {
    // Simulate fetching roadmaps from backend
      const newRoadmap = await axios.get("http://localhost:8000/roadmap", { withCredentials: true }).then(res => res.data).catch(err => {
      console.error("Failed to fetch roadmaps", err);
      });

      const overview = await axios.get("http://localhost:8000/api/overview", { withCredentials: true }).then(res => res.data).catch(err => {
        console.error("Failed to fetch overview data", err);
      });
      
       
      if (newRoadmap && newRoadmap.length > 0) {
      const roadmap_result = {
        roadmap_title: newRoadmap[0].roadmap_title || "Roadmap Title",
        total_duration_weeks: newRoadmap[0].total_duration_weeks || 0,
        phases: [
          ...newRoadmap[0].phases.map(p => ({
            phase_name: p.phase_name,
            focus_area: p.focus_area,
            duration_weeks: p.duration_weeks,
            topics: p.topics.map(t => t.topic_name),
            expected_outcome: p.expected_outcome,
            status: p.status
          }))
        ],
        final_capstone: {
          title: newRoadmap[0].final_capstone.title,
          description: newRoadmap[0].final_capstone.description,
          skills_validated: newRoadmap[0].final_capstone.skills_validated
        }
      };

     // ensure overviewData is updated before using it to calculate progress
      
    const roadmap_box = {
      id: 1, title: newRoadmap[0].roadmap_title,
      target: newRoadmap[0].target, progress: overview?.completion_rate || 0, weeks: overview?.total_days/7 || 0, phase: overview?.current_phase || "Phase 1 · Foundations",
      status: "active", tags: [ `${newRoadmap[0].phases.length} Phases`, `${newRoadmap[0].total_duration_weeks} Weeks`]
    }
    
    setGeneratedRoadmap(roadmap_result);

    setViewingRoadmap(roadmap_result);
    setRoadmapCard([roadmap_box]);
    }

  };

  

   useEffect(() => {
    
    handle_roadmap_result();
      
    }, []);
  return (
    <>
        <TopBar activePage={"roadmaps"} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>
                Your <span style={{ color: "var(--accent)" }}>Roadmaps</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {roadmapCard.length} total · {roadmapCard.filter(r => r.status === "active").length} active
            </div>
            </div>
            <button className="btn-next" disabled={!(roadmapCard.length === 0)} onClick={() => setShowCreate(true)} style={{ padding: "10px 22px" }}>
            <span>+</span> New Roadmap
            </button>
        </div>

        <div className="roadmaps-grid">
            {/* Create card */}
            {roadmapCard.length === 0 && (
            <div className="create-card" onClick={() => setShowCreate(true)}>
            <div className="create-icon">+</div>
            <div className="create-label">Create new roadmap</div>
            <div className="create-sub">Answer a few questions and let AI build your path</div>
            </div>
            )}

            {roadmapCard.map(rm => (
            <div key={rm.id} className="roadmap-card" onClick={() => setShowRoadmap(true)}>
                <div className="roadmap-card-header">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {rm.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, color: "var(--muted)", padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 20 }}>{t}</span>
                    ))}
                </div>
                <span className={`roadmap-status status-${rm.status}`}>{rm.status}</span>
                </div>
                <div className="roadmap-title">{rm.title}</div>
                <div className="roadmap-meta">{rm.phase}</div>
                <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${rm.progress}%` }} />
                </div>
                <div className="progress-label">
                <span>Progress</span>
                <span style={{ color: "var(--accent)" }}>{rm.progress}%</span>
                </div>
            </div>
            ))}
        </div>
        {showCreate && !generating && (
          <CreateRoadmapModal onClose={() => setShowCreate(false)} onGenerate={handleGenerate} />
        )}

        {generating && (
          <div className="overlay">
            <div className="form-modal" style={{ maxWidth: 480 }}>
              <GeneratingView  />
            </div>
          </div>
        )}

        {showRoadmap && !generating && (
          <RoadmapViewerModal roadmap={viewingRoadmap} onClose={() => setShowRoadmap(false)} handleDeleteRoadmap={handleDeleteRoadmap} />
        )}
    </>
  );
}