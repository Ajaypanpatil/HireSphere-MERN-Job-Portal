import { useState } from "react";
import { startInterview, sendAnswer, endInterview } from "../services/api";

export default function InterviewPage() {
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleStart = async () => {
    try {
      const res = await startInterview("Frontend Developer", "React, JavaScript");
      setInterviewId(res.interviewId);
      setQuestion(res.firstQuestion);
    } catch (err) {
      console.error("Error starting interview:", err);
      alert(err);
    }
  };

  const handleSendAnswer = async () => {
    try {
      const res = await sendAnswer(interviewId, answer);
      setQuestion(res.nextQuestion);
      setAnswer("");
    } catch (err) {
      console.error("Error sending answer:", err);
    }
  };

  const handleEnd = async () => {
    try {
      const res = await endInterview(interviewId);
      setFeedback(res.feedback);
      setQuestion(null);
    } catch (err) {
      console.error("Error ending interview:", err);
    }
  };

  return (
    <div className="p-6">
      {!interviewId ? (
        <button onClick={handleStart} className="bg-blue-500 text-white px-4 py-2 rounded">
          Start Interview
        </button>
      ) : feedback ? (
  <div className="p-4 border rounded shadow bg-gray-50">
    <h2 className="text-2xl font-bold mb-2">Interview Feedback</h2>
    
    <div className="mb-4">
      <h3 className="text-lg font-semibold">Summary:</h3>
      <p>{feedback.summary}</p>
    </div>

    <div className="mb-4">
      <h3 className="text-lg font-semibold">Strengths:</h3>
      {feedback.strengths && feedback.strengths.length > 0 ? (
        <ul className="list-disc list-inside">
          {feedback.strengths.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>None noted.</p>
      )}
    </div>

    <div className="mb-4">
      <h3 className="text-lg font-semibold">Weaknesses:</h3>
      {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
        <ul className="list-disc list-inside">
          {feedback.weaknesses.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>None noted.</p>
      )}
    </div>

    <div className="mb-2">
      <h3 className="text-lg font-semibold">Score:</h3>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${feedback.score || 0}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">{feedback.score || 0} / 100</p>
    </div>

    <button
      onClick={() => {
        setFeedback(null);
        setInterviewId(null);
        setQuestion(null);
      }}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Start New Interview
    </button>
  </div>
) : (
        <div>
          <p className="mb-4">{question}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border rounded p-2"
          />
          <div className="mt-4 space-x-2">
            <button onClick={handleSendAnswer} className="bg-green-500 text-white px-4 py-2 rounded">
              Submit Answer
            </button>
            <button onClick={handleEnd} className="bg-red-500 text-white px-4 py-2 rounded">
              End Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
