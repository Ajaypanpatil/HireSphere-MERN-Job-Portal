import React, { useEffect, useState } from "react";
import { getMyInterviews } from "../services/api";

const InterviewFeedback = () => {
  const [interviews, setInterviews] = useState([]);

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
    if (!feedback) return null;

    let parsed = feedback;

    // If summary is a JSON string (like in your example)
    if (typeof feedback.summary === "string") {
      try {
        // Remove ```json ... ``` if present
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
                  className="border p-6 rounded-lg shadow bg-white mx-auto"
                >
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
                        className="bg-green-500 h-4 rounded-full"
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
