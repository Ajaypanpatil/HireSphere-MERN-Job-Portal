import { useState, useEffect } from "react";
import api from "../services/api"; // we’ll use axios directly for filters

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/jobs", {
        params: {
          page,
          keyword: keyword || undefined,
          location: location || undefined,
          employmentType: employmentType || undefined,
        },
      });

      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Your Dream Job</h1>

      {/* Search Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Keyword (e.g. React, Java)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Jobs List */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded p-6 shadow hover:shadow-lg">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-500 text-sm">
                {job.location} • {job.employmentType}
              </p>
              <a
                href={`/jobs/${job._id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                View Details →
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Jobs;
