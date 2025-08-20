import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { applyToJob } from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await applyToJob(job._id);
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (err) {
      if (err.response && err.response.status === 409) {
      alert("You have already applied for this job.");
      setApplied(true); // mark as applied anyway
    } else {
      alert("Failed to apply for this job.");
    }}
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading job...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!job) return <p className="text-center mt-10">Job not found</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:underline"
      >
        &larr; Back
      </button>
      <div className="border rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Company:</span> {job.company}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Salary:</span> {job.salary}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Posted on:</span>{" "}
          {new Date(job.postedAt).toLocaleDateString()}
        </p>
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>

        <button
          className={`mt-6 w-full ${
            applied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium py-2 px-4 rounded transition-colors duration-300`}
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
}

export default JobDetails;
