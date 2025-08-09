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
