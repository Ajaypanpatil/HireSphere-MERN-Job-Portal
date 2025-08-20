import Job from "../models/Job.js";

// create of job
export const createJob = async (req, res) => {
  const user = req.user; // it is coming from protected middleware so recruiter can create job

  if (user.role != "recruiter") {
    return res.status(403).json({ message: "Only recruiter can post a job" });
  }

  const { title, description, skills, location, salary, employmentType } =
    req.body;

  if (
    !title ||
    !description ||
    !skills ||
    !location ||
    !salary ||
    !employmentType
  ) {
    return res.status(400).json({
      message: "Title, description, skills, and location are required.",
    });
  }

  try {
    const job = new Job({
      recruiter: user.id,
      company: user.company,
      title,
      description,
      skills,
      location,
      salary,
      employmentType,
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully.", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// list the job

export const listJobs = async (req, res) => {
  try {
    const { location, skills, employmentType, page = 1, limit = 10 } = req.query;

    const filter = { status: 'Open' };

    if (location) {
      filter.location = new RegExp(location, "i");
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (skills) {
      const skillsArray = skills.split(",").map((skills) => skills.trim());
      filter.skills = { $all: skillsArray };
    }

    const jobs = await Job.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ postedAt: -1 })
      .populate("recruiter", "name email");

      const total = await Job.countDocuments(filter);

      res.json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
      jobs,
    });


  } catch (error) {
    console.error("List jobs error:", error);
    res.status(500).json({ message: "Server error, job is not listing." });
  }
};



// get a single job

export const getJobById = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId).populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// get jobs created by logged-in recruiter
export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view their posted jobs" });
    }

    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ createdAt: -1 })
      .populate("recruiter", "name email");

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({ message: "Server error, could not fetch your jobs." });
  }
};



//  update job by only recruiter who created it 
export const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const recruiterId = req.user.id; // from auth middleware
  const updates = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    // Update allowed fields only (to avoid arbitrary updates)
    const allowedUpdates = ["title", "description", "skills", "location", "salary", "employmentType", "status"];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        job[field] = updates[field];
      }
    });

    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete job by recruiter 

export const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const recruiterId = req.user.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    // Delete job by id
    await Job.findByIdAndDelete(jobId);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
