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

// recruiter get his created jobs
export const getMyJobs = async () => {
  const { data } = await api.get("/jobs/my-jobs");
   console.log("API Response:", data);
  return data; 
};


// recruiter delete his created jobs
export const deleteJob = async (jobId) => {
  const { data } = await api.delete(`/jobs/${jobId}`);
  return data;
};



// // Get applicants for a specific job
export const getJobApplicants = async (jobId) => {
  const { data } = await api.get(`/jobs/${jobId}/applicants`);
  return data; // Array of applicants
};

// // Update application status
export const updateApplicantStatus = async (jobId, applicantId, status) => {
  const { data } = await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, {
    status,
  });
  return data;
};

//  candidate job post 

export default api;
