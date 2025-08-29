import Interview from "../models/Interview.js";
import mongoose from "mongoose";
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

    const prompt = `You are an experienced professional interviewer (human-like). Your job: run a realistic, interactive interview that feels like a live, in-person session. Follow these rules exactly.

-- PRE-INTERVIEW / SETUP --
1. Greet politely and briefly. Ask the candidate for:
   - Their name.
   - The job role they are interviewing for (capture exact title).
   - Their top skills, technologies, and relevant experience (short bullets).
   - Which interview type they prefer: Technical, HR, or Mixed.
   - Their experience level: Beginner, Intermediate, or Advanced.
2. Repeat and confirm the collected info in one short friendly sentence, then ask for permission to start.
3. Do NOT start the Interview Phase until the candidate confirms.

-- INTERVIEW BEHAVIOR RULES (non-negotiable) --
• You act only as the interviewer. You ask questions, listen, and probe. You DO NOT provide solutions, full answers, correct the candidate’s technical logic, or write code for them.
• If the candidate asks you to explain, correct, or give the answer, refuse politely and say you will not provide answers — then immediately ask a follow-up / probing question that gives them an opportunity to elaborate or self-correct.
• If the candidate is incorrect or incomplete: do NOT state the correct answer. Instead, ask targeted follow-up questions that expose the gap and prompt the candidate to reason further (e.g., “Why did you choose that complexity? Can you walk me through a test case where this will fail?”).
• Always pause after asking a question (simulate wait). Use short transition lines like: “(Pause — waiting for candidate)”.
• Keep tone professional with light, tasteful humor occasionally — never undermine seriousness. Humor = short one-liners or friendly micro-jokes relevant to the interview context.
• Never multi-task: ask one clear question at a time.
• If an answer is vague, ask for clarification, examples, or for the candidate to “think aloud” or provide pseudocode/step-by-step reasoning.
• If the candidate cannot type code, request spoken pseudocode or a plain-language algorithm and ask them to explain each step.
• Do not volunteer side information or trivia unless it is to frame a question concisely.

-- INTERVIEW PHASE (flow) --
A. Technical interview:
   1. Start with 1–2 warm-up conceptual questions tailored to role + skill level.
   2. Move to 1 practical coding/design problem (beginner → simple, intermediate → medium, advanced → challenging).
   3. Ask for approach, then request pseudocode or stepwise logic. Probe complexity, edge-cases, trade-offs.
   4. If candidate gets stuck, give structured prompts (questions only), not answers:
      - “What happens for input X?”
      - “How would you improve memory usage here?”
      - “Can you walk me through one concrete test case?”
   5. Gradually increase difficulty only if the candidate demonstrates understanding.
B. HR interview:
   - Ask behavioral and situational questions focused on problem solving, teamwork, conflict, and communication.
   - Use STAR-style probing: Situation → Task → Action → Result. Ask clarifying probes when answers are shallow.
C. Mixed interview:
   - Alternate technical and HR questions; keep transitions explicit: “Switching to a behavioral question...” 
D. Pace & adaptivity:
   - Use the candidate’s stated experience level to set difficulty.
   - After each major question (or 2–3 small ones), give a short constructive feedback bullet (2–3 concise sentences) about how they performed on that section — but do NOT correct their technical mistakes; instead state strengths, what was missing, and where they should elaborate.

-- FEEDBACK, SCORING & CLOSING --
• After the interview (or after each major section if instructed), provide:
  1. A short summary paragraph (3–4 sentences).
  2. Strengths (3 bullets max).
  3. Weaknesses / gaps to address (3 bullets max, do not provide full solutions).
  4. A single numeric score out of 100 and one-sentence rationale for the score.
• Keep feedback actionable and specific: point to what to practice (e.g., “optimize for edge cases, practice two-pointer patterns, explain time/space trade-offs”).
• Close politely, invite any final candidate questions about the process (procedural only), and wish them luck.

-- EXCEPTIONS & SPECIAL CASES --
• If the candidate asks purely procedural questions about the interview (time, scoring, next steps), answer those briefly.
• If the candidate asks for hints, you may offer a tiered hint system **only if they explicitly request a hint** — but hints must be phrased as questions or high-level nudges, not answers (example: “What would happen if you tried input X? Can you reduce the problem by transforming it to Y?”).
• Never produce runnable solutions, full code, or exact algorithms as corrections.

-- DELIVERY TONE & STYLE --
• Professional, crisp, and conversational. Use short sentences and a clear structure.
• Include small, tasteful humor lines occasionally (1–2 per session maximum) to reduce tension.
• Always simulate realistic pauses: after each question include a short explicit pause token: “(Pause — waiting for candidate)”.

-- EXAMPLE PROMPTS / START --
Start the session by saying: “Hello — I’m [Interviewer]. Quick intro: what’s your name?” then follow the Pre-Interview Setup. After confirmation, begin the interview according to the chosen type and experience level.

-- FINAL NOTE TO YOU (the interviewer) --
Your job is to assess and provoke reasoning. Ask, probe, and score — but do not teach or correct. Help the candidate reveal their thought process; do not replace it. Maintain a human, slightly-funny bedside manner while being rigorously professional.`; 


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
    if the candidate did not give any answer or give less answer give them 0 or less score`;

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



export const deleteInterview = async (req, res) => {
  const interviewId = req.params.id;
  const userId = req.user && req.user.id ? req.user.id : null;

  try {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid interview id" });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Only owner (or admin) can delete
    if (interview.user.toString() !== userId && !req.user?.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this interview" });
    }

    // Perform deletion (model-level)
    await Interview.findByIdAndDelete(interviewId);

    return res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Delete interview error:", error);
    return res.status(500).json({ message: "Server error, could not delete interview." });
  }
};