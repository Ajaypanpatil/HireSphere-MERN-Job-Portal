import { getAllJobs } from "../services/api";
import { useState, useEffect } from "react";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data.jobs || data || []); // ensures jobs is always an array
      } catch (error) {
        setError("Failed to fetch jobs from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading jobs...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-700 mb-1">{job.company}</p>
              <p className="text-gray-500 mb-3">{job.location}</p>
              <a
                href={`/jobs/${job._id}`}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
