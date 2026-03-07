import { Navigate } from "react-router-dom";
const PublicRoute = ({ user, children }) => {
  if (user) {
    console.log("user data in public route", user);
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;