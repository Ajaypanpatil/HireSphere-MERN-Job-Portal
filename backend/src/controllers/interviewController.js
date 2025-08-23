import Interview from "../models/Interview.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------- GEMINI HELPER ----------------
function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

function extractText(result) {
  return (
    result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
  );
}

// ---------------- START INTERVIEW ----------------
export const startInterview = async (req, res) => {
  try {
    const { jobRole, specification } = req.body;

    if (!jobRole) {
      return res.status(400).json({ message: "Job role is required" });
    }

    const interview = new Interview({
      user: req.user._id,
      jobRole,
      specification,
      conversation: [],
    });

    const prompt = `You are an interviewer for the role of ${jobRole}.
    Ask the candidate the first interview question based on ${specification || "general requirements"}.
    Keep it short and clear.`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const firstQuestion = extractText(result);

    interview.conversation.push({ question: firstQuestion });
    await interview.save();

    res.status(201).json({ interviewId: interview._id, firstQuestion });
  } catch (err) {
    console.error("Start Interview Error:", err);
    res.status(500).json({ message: "Error starting interview" });
  }
};

// ---------------- ADD ANSWER ----------------
// ---------------- ADD ANSWER ----------------
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params; // interviewId from URL
    const { answer } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Save candidate’s answer
    interview.conversation.push({ answer });

    // Build conversation context
    const conversationHistory = interview.conversation
      .map((turn, i) =>
        turn.question
          ? `Q${Math.floor(i / 2) + 1}: ${turn.question}`
          : `A${Math.floor(i / 2) + 1}: ${turn.answer}`
      )
      .join("\n");

    // Prompt with job role + full history
    const prompt = `
You are conducting a professional job interview for the role of ${interview.jobRole}.
Specification: ${interview.specification || "general requirements"}

Here is the conversation so far:
${conversationHistory}

Now, as the interviewer:
1. Acknowledge the candidate's last answer.
2. Ask the next relevant follow-up interview question.
Keep it professional, clear, and concise.
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const nextQuestion = extractText(result);

    // Save next question
    interview.conversation.push({ question: nextQuestion });
    await interview.save();

    res.status(200).json({ nextQuestion });
  } catch (err) {
    console.error("Add Answer Error:", err);
    res.status(500).json({ message: "Error adding answer" });
  }
};


// ---------------- END INTERVIEW ----------------
export const endInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const prompt = `
      Analyze this interview conversation:
      ${JSON.stringify(interview.conversation)}

      Provide feedback in JSON format with keys:
      {
        "summary": "short summary of performance",
        "strengths": ["point1", "point2"],
        "weaknesses": ["point1", "point2"],
        "score": number (0-100)
      }
    `;

    const model = getGeminiModel();   // ✅ FIXED: defined model
    const result = await model.generateContent(prompt);
    let feedbackText = extractText(result);

    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch {
      feedback = {
        summary: feedbackText,
        strengths: [],
        weaknesses: [],
        score: 0,
      };
    }

    interview.feedback = feedback;
    await interview.save();

    res.json(interview);
  } catch (err) {
    console.error("End Interview Error:", err);
    res.status(500).json({ message: "Error ending interview" });
  }
};

// ---------------- GET MY INTERVIEWS ----------------
export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching interviews" });
  }
};
