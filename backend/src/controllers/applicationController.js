import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Check if candidate has already applied to a specific job
export const checkApplication = async (req, res) => {
  const candidateId = req.user.id;
  const { jobId } = req.params;

  try {
    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId,
    });

    return res.status(200).json({ applied: !!existingApplication });
  } catch (error) {
    console.error("Check application error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



//  candidate apply for the job
export const applyToJob = async (req, res) => {
  const candidateId = req.user.id;

  const { jobId, resumeUrl } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: "Where is job id" });
  }

  try {
    // check if job is open or not

    const job = await Job.findById(jobId);
    if (!job || job.status !== "Open") {
      return res.status(404).json({ message: "Job not found or not open" });
    }

    // prevent duplicate appplication
    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId,
    });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "You have already applied to this job" });
    }

    // create Application

    const application = new Application({
      candidate: candidateId,
      job: jobId,
      resumeUrl,
    });

    await application.save();
    res.status(201).json({ message: "Applied Succesfully" });

    
  } catch (error) {
    console.error("Apply to job error:", error);
    res.status(500).json({ message: "Server error, while applying job" });
  }
};

// Recruiter views applications for their jobs

export const getApplicationsForRecruiter = async (req, res) => {
  const recruiterId = req.user.id;

  try {
    // Find all applications where the job belongs to this recruiter
    const applications = await Application.find()
      .populate({
        path: 'job',
        match: { recruiter: recruiterId },  // filter jobs by recruiter
        select: 'title location',
      })
      .populate('candidate', 'name email')
      .exec();

    // Filter out applications with null job (i.e., jobs not belonging to recruiter)
    const filteredApplications = applications.filter(app => app.job !== null);

    res.json({ total: filteredApplications.length, applications: filteredApplications });
  } catch (error) {
    console.error("Get applications for recruiter error:", error);
    res.status(500).json({ message: "Server error"});
  }
};

// Candidate views their applications

export const getApplicationsForCandidate = async (req, res) => {
  const candidateId = req.user.id;

  try {
    const applications = await Application.find({ candidate: candidateId })
      .populate('job', 'title location status')
      .exec();
    res.json({ total: applications.length, applications });

  } catch (error) {
    console.error("Get applications for candidate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Recruiter updates application status

export const updateApplicationStatus = async (req, res) => {
    const recruiterId = req.user.id;
    const applicationId = req.params.id;
    const {status} = req.body;

    if (!['Applied', 'Reviewed', 'Rejected', 'Accepted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    // Find application and populate job to check ownership
    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
    
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}