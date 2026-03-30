
import { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './TopBar';
import { useOutletContext } from 'react-router-dom';
import tickIcon from "../../assets/tick.svg";

export default function Overview() {
  const { logout } = useOutletContext() || {};

    const [roadmapCard, setRoadmapCard] = useState([]);
  
    const [overviewData , setOverviewData] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);

    const handle_roadmap_result = async () => {
    // Simulate fetching roadmaps from backend
      const newRoadmap = await axios.get("http://localhost:8000/roadmap", { withCredentials: true }).then(res => res.data).catch(err => {
      console.error("Failed to fetch roadmaps", err);
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
      
    const roadmap_box = {
      id: 1, title: newRoadmap[0].roadmap_title,
      target: newRoadmap[0].target, progress: 38, weeks: 24, phase: "Phase 2 · DSA & System Design",
      status: "active", tags: [ `${newRoadmap[0].phases.length} Phases`, `${newRoadmap[0].total_duration_weeks} Weeks`]
    }
    
    

    
    setRoadmapCard([roadmap_box]);
    }

  };
  const get_overview_data = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/overview", { withCredentials: true });
      console.log("DEBUG: Fetched overview data:", response.data);
      setOverviewData(response.data);
    } catch (err) {
      console.error("Failed to fetch overview data", err);
    }
  };

   const get_recently_completed_tasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/recent_tasks", { withCredentials: true });
      if (response.data[0] === "No Task Data") {
        setRecentTasks(["No Task Data"]);
      }
      else {
        console.log("DEBUG: Fetched recent tasks:", response.data);
        setRecentTasks(response.data);
      }

    } catch (err){
      console.error("Failed to fetch recent tasks",err);
    }
  };

  useEffect(() => {
    handle_roadmap_result();
    get_overview_data();
    get_recently_completed_tasks()
    console.log("DEBUG: Fetched roadmap from backend:", roadmapCard);
  }, []);

  


    return( 
    <>
      <TopBar activePage={"overview"} logout={logout} />
        
        {/* Stats */}
        <div className="stat-row">
            {[
            { label: "Active Roadmaps", value: overviewData?.active_roadmaps || 0, suf: "", meta: "↑" },
            { label: "Completion Rate", value: overviewData?.completion_rate || "0", suf: "%", meta: overviewData?.current_roadmap || "No active roadmap" },
            { label: "Study Streak", value: overviewData?.study_streak || 0, suf: " days", meta: overviewData?.study_streak ? "Personal best" : "" },
            { label: "Tasks Done", value: overviewData?.tasks_done || 0, suf: "", meta: "" },
            ].map(s => (
            <div key={s.label} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}<em>{s.suf}</em></div>
                <div className="stat-meta">{s.meta}</div>
            </div>
            ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {/* Skill Overview */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div className="section-header"  >
                <div className="section-title-sm" style={{fontSize:20}}> <span>Overview :</span> {overviewData?.current_roadmap || "Generate Roadmap"} </div>
            </div>
            <div  className="section-title-sm" style={{ fontSize: 15, marginBottom: 18 }}>
                Current Phase: <span>{overviewData?.current_phase || "NA"}</span>
            </div>
            <div  className="section-title-sm" style={{ fontSize: 15, marginBottom: 18 }}>
                Current Topic: <span>{overviewData?.current_topic || "NA"}</span>
            </div>
            <div  className="section-title-sm" style={{ fontSize: 15, marginBottom: 18 }}>
                <span style={{fontSize: 22, margin: "0 4px"}}>{overviewData?.current_topic_days_completed || 0}/{overviewData?.current_topic_total_days || 0}</span> days remaining for the topic <span>{overviewData?.current_topic || "NA"}</span> 
            </div>
            <div  className="section-title-sm" style={{ fontSize: 15, marginBottom: 18 }}>
                <span style={{fontSize: 22, margin: "0 4px"}}>{overviewData?.current_phase_remaining_topics || "0"}</span> Topics are remaining in Phase <span>{overviewData?.current_phase || "NA"}</span>
            </div>
            {/* <div className="skill-bars">
                {skills.map(s => (
                <div key={s.label} className="skill-bar-row">
                    <span className="skill-bar-label">{s.label}</span>
                    <div className="skill-bar-track">
                    <div className="skill-bar-fill" style={{ width: `${(s.val / 5) * 100}%`, background: s.color }} />
                    </div>
                    <span className="skill-bar-val">{s.val}/5</span>
                </div>
                ))}
            </div> */}
            </div>

            {/* Recent Activity */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div className="section-header">
                <div className="section-title-sm" style={{fontSize:20}}>Recent <span>Activity</span></div>
            </div>
            <div className="activity-list">
                {recentTasks[0] === "No Task Data" ? (
                <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>
                    No completed tasks yet. Complete tasks to see them here!
                </div>
                ) : (
                
                recentTasks.map((a, i) => (
                <div key={i} className="activity-item">
                    <div className="activity-icon">
                        <img style={{ width: 20, height: 20 }} src={tickIcon} alt="Tick" />
                    </div>
                    <div>
                    <div className="activity-text">{a}</div>
                    <div className="activity-time">Daily Task</div>
                    </div>
                </div>
                )))}
            </div>
            </div>
        </div>

        {/* Active Roadmaps preview */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div className="section-header">
            <div className="section-title-sm">Active <span>Roadmaps</span></div>
            
            </div>
            <div className="roadmaps-grid">
            {roadmapCard.filter(r => r.status === "active").slice(0, 2).map(rm => (
                <div key={rm.id} className="roadmap-card" >
                <div className="roadmap-card-header">
                    <div>
                    {rm.tags.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: 10, color: "var(--muted)", marginRight: 8 }}>{t}</span>
                    ))}
                    </div>
                    <span className={`roadmap-status status-${rm.status}`}>{rm.status}</span>
                </div>
                <div className="roadmap-title">{rm.title}</div>
                <div className="roadmap-meta">{rm.phase}</div>
                
                
                </div>
            ))}
            </div>
        </div>
    </>
    )
}