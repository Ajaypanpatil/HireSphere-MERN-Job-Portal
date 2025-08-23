import { useState } from "react";
import { startInterview, sendAnswer, endInterview } from "../services/api";

export default function InterviewPage() {
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // -------------------- Text-to-Speech --------------------
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  // -------------------- Speech-to-Text --------------------
  const startListening = (onResult) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // -------------------- API Handlers --------------------
  const handleStart = async () => {
    try {
      const res = await startInterview("Frontend Developer", "React, JavaScript");
      setInterviewId(res.interviewId);
      setQuestion(res.firstQuestion);
      speakText(res.firstQuestion); // speak first question
    } catch (err) {
      console.error("Error starting interview:", err);
      alert(err);
    }
  };

  const handleSendAnswer = async (voiceAnswer) => {
    try {
      const ans = voiceAnswer ?? answer; // use voice input if provided
      const res = await sendAnswer(interviewId, ans);
      setQuestion(res.nextQuestion);
      setAnswer("");
      if (res.nextQuestion) speakText(res.nextQuestion); // speak next question
    } catch (err) {
      console.error("Error sending answer:", err);
    }
  };

  const handleEnd = async () => {
    try {
      const res = await endInterview(interviewId);
      setFeedback(res.feedback);
      setQuestion(null);
      if (res.feedback?.summary) speakText("Interview ended. Here is your feedback summary.");
    } catch (err) {
      console.error("Error ending interview:", err);
    }
  };

  return (
    <div className="p-6">
      {!interviewId ? (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
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
            className="w-full border rounded p-2 mb-2"
          />

          <div className="flex gap-2 mt-2">
            {/* Submit typed answer */}
            <button
              onClick={() => handleSendAnswer()}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit Answer
            </button>

            {/* End interview */}
            <button
              onClick={handleEnd}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              End Interview
            </button>

            {/* Speak question */}
            <button
              onClick={() => speakText(question)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              🔊 Listen
            </button>

            {/* Speak and record answer */}
            <button
              onClick={() =>
                startListening((voiceText) => {
                  setAnswer(voiceText);
                  handleSendAnswer(voiceText);
                })
              }
              className="bg-purple-500 text-white px-2 py-1 rounded"
            >
              🎤 Answer by Voice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
