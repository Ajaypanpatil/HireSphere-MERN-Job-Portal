// src/pages/PostJob.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createJob } from "../services/api";

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Basic form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "", // comma separated input
    location: "",
    salary: "",
    employmentType: "Full-time",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only recruiters should see this page; you can also guard with route-level protection
  if (!user || user.role !== "recruiter") {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-red-600">Access denied. Recruiter account required.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.title.trim() || !form.description.trim() || !form.skills.trim()) {
      setError("Title, description and skills are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      location: form.location.trim() || "Remote",
      salary: form.salary ? form.salary.trim() : "",
      employmentType: form.employmentType,
    };

    try {
      setLoading(true);
      await createJob(payload); // calls backend POST /jobs
      setLoading(false);
      // redirect to recruiter dashboard or my jobs page
      navigate("/recruiter"); // or "/dashboard" depending on your routes
    } catch (err) {
      console.error("Create job error:", err);
      setLoading(false);
      setError(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a New Job</h1>

      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Senior Frontend Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="6"
            className="w-full border p-2 rounded"
            placeholder="Describe the role, responsibilities, tech stack..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Skills (comma separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="React, Node.js, MongoDB"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Bangalore / Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Salary</label>
            <input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="₹8-12 LPA or USD 80k-100k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Employment Type</label>
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Posting…" : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
