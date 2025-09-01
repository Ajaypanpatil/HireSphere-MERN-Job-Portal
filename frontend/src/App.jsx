import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; // Public layout (navbar + footer)
import CandidateLayout from "./components/CandidateLayout"; // New
import RecruiterLayout from "./components/RecruiterLayout"; // New

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";

// Candidate pages
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";

// Recruiter pages
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";

// Other
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Pages ---------- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Route>

        {/* Auth pages (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- Candidate Dashboard ---------- */}
        <Route
          path="/candidate"
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <CandidateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<CandidateDashboard />} />
          <Route path="applications" element={<CandidateDashboard />} />
          <Route path="profile" element={<CandidateDashboard />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="my-interviews" element={<InterviewHistory />} />
        </Route>

        {/* ---------- Recruiter Dashboard ---------- */}
        <Route
          path="/recruiter"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <RecruiterLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<MyJobs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
