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


// ===================== PUBLIC JOB LISTING =====================

// Get all jobs (for candidate/public view)
export const getAllJobs = async () => {
  const { data } = await api.get("/jobs");
  return data;
};


// ===================== APPLICATIONS =====================
export const applyToJob = async (jobId) => {
  const { data } = await api.post("/applications/apply", { jobId });
  return data;
};



// ===================== INTERVIEWS =====================

// Start new interview
export const startInterview = async (jobRole, specification) => {
  const { data } = await api.post("/interview/start", { jobRole, specification });
  return data; // { interviewId, firstQuestion }
};

// Send answer + get next question
export const sendAnswer = async (interviewId, answer) => {
  const { data } = await api.post(`/interview/${interviewId}/answer`, { answer });
  return data; // { nextQuestion, interview }
};

// End interview + get feedback
export const endInterview = async (interviewId) => {
  const { data } = await api.post(`/interview/${interviewId}/end`);
  return data; // interview with feedback
};

// Get history of interviews
export const getMyInterviews = async () => {
  const { data } = await api.get("/interview/my");
  return data;
};

export const deleteInterview = async (interviewId) => {
  const { data } = await api.delete(`/interview/${interviewId}`);
  return data;
};



export default api;
