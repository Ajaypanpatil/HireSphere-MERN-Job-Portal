// src/pages/MyJobs.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMyJobs, deleteJob } from "../services/api";

export default function MyJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null); // track which job is being deleted

  useEffect(() => {
    if (user?.role === "recruiter") {
      loadJobs();
    } else {
      setError("Access denied. Recruiter account required.");
      setLoading(false);
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getMyJobs();
      console.log(data)
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.response?.data?.message || "Failed to load jobs from database");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      setDeleting(jobId);
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job.id !== jobId && job._id !== jobId));
    } catch (err) {
      console.error("Delete job error:", err);
      alert(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading your jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Posted Jobs</h1>
        <Link
          to="/post-job"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-600">You haven’t posted any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id || job._id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-gray-700">{job.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.location} • {job.employmentType} • {job.salary || "Salary not specified"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Skills: {job.skills?.join(", ") || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Link
                  to={`/jobs/${job.id || job._id}/applicants`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  View Applicants
                </Link>
                <Link
                  to={`/edit-job/${job.id || job._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id || job._id)}
                  disabled={deleting === (job.id || job._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm disabled:opacity-60"
                >
                  {deleting === (job.id || job._id) ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
