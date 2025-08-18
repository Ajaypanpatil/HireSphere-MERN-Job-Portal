import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        background: "#eee",
      }}
    >
      <Link to="/">Home</Link>

      {isAuthenticated && user?.role === "recruiter" && (
        <>
          <Link to="/recruiter">Recruiter Dashboard</Link>
          <Link to="/post-job">Post Job</Link>
          <Link to="/my-jobs" className="mr-4">My Jobs</Link>
        </>
      )}

      {isAuthenticated && user?.role === "candidate" && (
        <>
          <Link to="/candidate">Candidate Dashboard</Link>
          <Link to="/jobs">Browse Jobs</Link>
        </>
      )}

      

      

      {!isAuthenticated && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {isAuthenticated && (
        <>
          <span>Hi, {user?.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
