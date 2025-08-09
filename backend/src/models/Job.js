import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    require: true,
    maxlength: 3000,
  },

  skills: {
    type: [String],
    required: true,
  },

  location: {
    type: String,
  },

  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    default: "full-time",
  },

  postedAt: {
    type: Date,
    default: Date.now(),
  },

  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
});

const Job = mongoose.model('job', jobSchema);

export default Job;
