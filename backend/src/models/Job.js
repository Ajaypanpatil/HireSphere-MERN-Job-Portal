import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

  salary: {
  type: String,          
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

  company: { 
    type: String,  
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

const Job = mongoose.model('Job', jobSchema);

export default Job;



