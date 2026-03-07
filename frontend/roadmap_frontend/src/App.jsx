import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './LandingPage/LandingPage'
import Dashboard from './dashboard/dashboard'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import PublicRoute from '../PublicRoute'
import ProtectedRoute from '../ProtectedRoute'
import axios from 'axios'

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
        />
      </Routes>
    </Router>
  );
}
// function App() {
//   const [user , setUser] = useState();
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//   axios.get("/me", { withCredentials: true })
//     .then(res => setUser(res.data))
//     .catch(() => setUser(null));
// }, []);
//   if (loading) return <div>Loading...</div>;

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   )
// }

export default App
