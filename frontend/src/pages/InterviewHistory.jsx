import React, { useEffect, useState } from "react";
import { getMyInterviews, deleteInterview } from "../services/api"; // <-- added deleteInterview

const InterviewFeedback = () => {
  const [interviews, setInterviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null); // track which one is being deleted

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyInterviews();
        setInterviews(data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchData();
  }, []);

  const parseFeedback = (feedback) => {
    if (!feedback) return {
      summary: "",
      strengths: [],
      weaknesses: [],
      score: 0,
    };

    let parsed = feedback;

    if (typeof feedback.summary === "string") {
      try {
        const cleaned = feedback.summary.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.warn("Error parsing feedback JSON:", err);
      }
    }

    return {
      summary: parsed.summary || "",
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      score: parsed.score || 0,
    };
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  // <-- NEW: delete handler --
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this interview feedback? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteInterview(id); // assumes your API exposes this function
      // remove from UI
      setInterviews((prev) => prev.filter((iv) => iv._id !== id));
    } catch (err) {
      console.error("Error deleting interview:", err);
      alert("Could not delete the interview. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Interview Feedback Reports</h2>

      {interviews.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <div className="space-y-6">
          {interviews
            .filter((iv) => iv.feedback)
            .map((iv) => {
              const feedback = parseFeedback(iv.feedback);

              return (
                <div
                  key={iv._id}
                  className="border p-6 rounded-lg shadow bg-white mx-auto relative" // <-- make relative for absolute button
                >
                  {/* Delete button in corner */}
                  <button
                    onClick={() => handleDelete(iv._id)}
                    disabled={deletingId === iv._id}
                    title="Delete feedback"
                    aria-label="Delete feedback"
                    className="absolute top-4 right-4 ml-2 inline-flex items-center justify-center w-9 h-9 rounded-full text-sm border hover:bg-gray-100"
                  >
                    {deletingId === iv._id ? (
                      <span className="text-xs">Deleting…</span>
                    ) : (
                      // simple "trash" / "x" markup; replace with icon if you use an icon library
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 10-2 0v6a1 1 0 002 0V8zm6 0a1 1 0 10-2 0v6a1 1 0 002 0V8z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <h3 className="text-xl font-bold mb-2">{iv.jobRole}</h3>
                  <p className="text-gray-600 mb-4">
                    Date: {new Date(iv.createdAt).toLocaleString()}
                  </p>

                  {/* Summary */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Summary:</h4>
                    <p className="text-gray-800">{feedback.summary}</p>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Strengths:</h4>
                    {feedback.strengths.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-800">
                        {feedback.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">None</p>
                    )}
                  </div>

                  {/* Weaknesses */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Weaknesses:</h4>
                    {feedback.weaknesses.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-800">
                        {feedback.weaknesses.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">None</p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="mb-2">
                    <h4 className="font-semibold text-gray-700 mb-1">Score:</h4>
                    <div className="w-full bg-gray-200 h-4 rounded-full">
                      <div
                        className={`${getScoreColor(feedback.score)} h-4 rounded-full`}
                        style={{ width: `${feedback.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">{feedback.score} / 100</p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default InterviewFeedback;
