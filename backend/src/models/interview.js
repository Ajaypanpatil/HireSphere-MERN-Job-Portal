import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobRole: { type: String, required: true },
  specification: { type: String },
  conversation: [
    {
      question: String,
      answer: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  feedback: {
    summary: String,
    strengths: [String],
    weaknesses: [String],
    score: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
