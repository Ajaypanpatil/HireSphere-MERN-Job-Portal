import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===================== RECRUITER JOBS =====================

// Create new job
export const createJob = async (jobData) => {
  const { data } = await api.post("/jobs/create", jobData);
  return data;
};

// Get jobs posted by the logged-in recruiter
export const getMyJobs = async () => {
  const { data } = await api.get("/applications/recruiter/");
  return data; // Array of jobs
};

// Get applicants for a specific job
export const getJobApplicants = async (jobId) => {
  const { data } = await api.get(`/jobs/${jobId}/applicants`);
  return data; // Array of applicants
};

// Update application status
export const updateApplicantStatus = async (jobId, applicantId, status) => {
  const { data } = await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, {
    status,
  });
  return data;
};

export default api;
