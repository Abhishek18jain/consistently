// CoachScreen.jsx
import { useState } from "react";

export default function CoachScreen() {
  const questions = [
    "What distracted you today?",
    "Which task felt hardest?",
    "How was your energy level?"
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (q, val) => {
    setAnswers({ ...answers, [q]: val });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Coach Analysis</h1>

      <div className="space-y-6 max-w-2xl">
        {questions.map((q, i) => (
          <div key={i} className="bg-zinc-900 p-4 rounded-xl">
            <p className="mb-2">{q}</p>
            <textarea
              className="w-full bg-zinc-800 rounded p-2"
              rows="3"
              onChange={(e) => handleChange(q, e.target.value)}
            />
          </div>
        ))}

        <button className="bg-emerald-600 px-6 py-3 rounded-lg">
          Submit Analysis
        </button>
      </div>
    </div>
  );
}
