import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './LandingPage/LandingPage'
import Dashboard from './dashboard/dashboard'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import PublicRoute from '../PublicRoute'
import ProtectedRoute from '../ProtectedRoute'
import axios from 'axios'
import Roadmap from './dashboard/modules/Roadmap'
import Overview from './dashboard/modules/Overview'
import DailyTasks from './dashboard/modules/DailyTasks'
import { Navigate } from 'react-router-dom'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check current user on mount
  useEffect(() => {
    axios.get("api/me", { withCredentials: true })
      .then(res => {
        console.log("User data received:", res.data);
        setUser(res.data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    axios.post("http://localhost:8000/logout", {}, { withCredentials: true })
      .catch(err => console.error("backend logout error", err))
      .finally(() => setUser(null));
      //refresh page to reset state and close any open connections (e.g. websocket)
      window.location.href = "/";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute user={user}>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard logout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Default route */}
          <Route index element={<Navigate to="overview" />} />

          {/* Sub routes */}
          <Route path="overview" element={<Overview />} />
          <Route path="roadmaps" element={<Roadmap />} />
          <Route path="dailytasks" element={<DailyTasks />} />
        </Route>

        
      </Routes>
    </Router>
  );
}


export default App
