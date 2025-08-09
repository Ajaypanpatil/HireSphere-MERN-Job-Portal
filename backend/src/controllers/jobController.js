import Job from "../models/Job.js";

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
    return res
      .status(400)
      .json({
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
