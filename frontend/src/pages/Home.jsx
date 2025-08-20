export default function Home() {
  return <h1 className="p-6">Home — Job listings will go here</h1>;
}









//code for getting jobcards to show in home page
/*
import { getAllJobs } from "../services/api";
import { useState, useEffect } from "react";
import JobCard from "../components/JobCards";

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
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;

*/