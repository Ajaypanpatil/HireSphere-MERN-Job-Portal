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
      const res = await startInterview("Java Developer", "core java, spring, dsa basic");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">AI Mock Interview</h1>
            <p className="text-sm text-gray-500 mt-1">One-page, turn-based interview flow — voice & text supported</p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-gray-500">Role</span>
            <div className="px-3 py-1 bg-white border rounded-full text-sm text-gray-700 shadow-sm">Frontend Developer</div>
          </div>
        </header>

        <main className="space-y-6">
          {/* Start screen */}
          {!interviewId ? (
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Ready to start?</h2>
              <p className="text-sm text-gray-500 mb-4">Click start and the AI will ask the first question aloud. You can answer by typing or using voice.</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  ▶️ Start Interview
                </button>

                <button
                  onClick={() => alert('Tip: Use the microphone button to answer verbally.')}
                  className="text-sm text-gray-600 underline"
                >
                  How it works
                </button>
              </div>
            </div>
          ) : feedback ? (
            /* Feedback view */
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Interview Feedback</h2>
                  <p className="text-sm text-gray-500 mt-1">Detailed strengths, weaknesses and score</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Final score</div>
                  <div className="mt-2 font-bold text-lg">{feedback.score || 0} / 100</div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Summary</h3>
                  <p className="text-sm text-gray-600 mt-1">{feedback.summary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700">Strengths</h4>
                    {feedback.strengths && feedback.strengths.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                        {feedback.strengths.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">None noted.</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700">Weaknesses</h4>
                    {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                        {feedback.weaknesses.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">None noted.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Score</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${feedback.score || 0}%`, backgroundColor: '#10B981' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setFeedback(null);
                    setInterviewId(null);
                    setQuestion(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Start New Interview
                </button>
              </div>
            </div>
          ) : (
            /* Interviewing view */
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl">🤖</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Question</h2>
                    <div className="text-sm text-gray-500">Turn-based • voice & text</div>
                  </div>

                  <div className="mt-3 bg-gray-50 border rounded-lg p-4 text-gray-700 min-h-[56px]">
                    <p>{question}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full border rounded-lg p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows={4}
                  placeholder="Type your short answer here (30s recommended)..."
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Submit typed answer */}
                    <button
                      onClick={() => handleSendAnswer()}
                      className="flex-1 sm:flex-none inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                      ✅ Submit Answer
                    </button>

                    {/* End interview */}
                    <button
                      onClick={handleEnd}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                      ⏹ End Interview
                    </button>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    {/* Speak question */}
                    <button
                      onClick={() => speakText(question)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow"
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
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg shadow"
                    >
                      🎤 Answer by Voice
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">Tip: Keep answers concise — 20–30 seconds for best results.</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}