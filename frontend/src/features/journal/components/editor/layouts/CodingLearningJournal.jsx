import { useState } from "react";

/**
 * Image 3: Coding Learning Journal
 */

const DEFAULT_JOURNAL = {
    title: "Daily Learning Log",
    date: "Today",
    learned: "Today I learned about...",
    concepts: [
        { id: "c-1", text: "React Hooks" },
        { id: "c-2", text: "State Management" }
    ],
    problems: [
        { id: "p-1", text: "Infinite loop in useEffect", solved: true },
        { id: "p-2", text: "CORS error on API call", solved: false }
    ],
    resources: "Links to articles, docs, or tutorials...",
    summary: "Brief conclusion of today's progress."
};

export default function CodingLearningJournal({ template, blocks, setBlocks }) {
    const mainBlock = blocks[0] || null;
    const journal = mainBlock?.data?.journal || DEFAULT_JOURNAL;

    const saveJournal = (newJournal) => {
        if (!mainBlock) return;
        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, journal: newJournal } } : b));
    };

    const updateField = (field, value) => saveJournal({ ...journal, [field]: value });

    // Concepts
    const addConcept = () => saveJournal({ ...journal, concepts: [...journal.concepts, { id: `c-${Date.now()}`, text: "New Concept" }] });
    const removeConcept = (idx) => {
        const newConcepts = [...journal.concepts];
        newConcepts.splice(idx, 1);
        saveJournal({ ...journal, concepts: newConcepts });
    };
    const updateConcept = (idx, value) => {
        const newConcepts = [...journal.concepts];
        newConcepts[idx].text = value;
        saveJournal({ ...journal, concepts: newConcepts });
    };

    // Problems
    const addProblem = () => saveJournal({ ...journal, problems: [...journal.problems, { id: `p-${Date.now()}`, text: "Describe problem...", solved: false }] });
    const removeProblem = (idx) => {
        const newProblems = [...journal.problems];
        newProblems.splice(idx, 1);
        saveJournal({ ...journal, problems: newProblems });
    };
    const updateProblem = (idx, field, value) => {
        const newProblems = [...journal.problems];
        newProblems[idx][field] = value;
        saveJournal({ ...journal, problems: newProblems });
    };

    return (
        <div className="py-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Coding Learning Journal
            </h1>

            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between relative overflow-hidden group">
                <div className="flex-1 w-full relative z-10">
                    <input
                        value={journal.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full mb-1"
                        placeholder="Log Title"
                    />
                    <input
                        value={journal.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        className="text-xs font-semibold text-gray-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                        placeholder="Date"
                    />
                </div>
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-emerald-50 to-transparent"></div>
            </div>

            {/* What did I learn */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-4 flex items-center gap-2">
                    <span>💡</span> What I Learned Today
                </h2>
                <textarea
                    value={journal.learned}
                    onChange={(e) => updateField("learned", e.target.value)}
                    className="w-full text-sm text-gray-700 bg-gray-50/50 rounded-2xl p-4 border-none outline-none focus:ring-2 focus:ring-emerald-100 resize-none min-h-[100px]"
                    placeholder="Write detailed notes about what you studied, built, or read..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concepts Grasped */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
                    <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-4 flex items-center gap-2">
                        <span>🧠</span> Concepts
                    </h2>
                    <ul className="space-y-2 list-disc pl-5">
                        {journal.concepts.map((concept, idx) => (
                            <li key={concept.id} className="text-gray-700 font-medium group relative marker:text-blue-500">
                                <button
                                    onClick={() => removeConcept(idx)}
                                    className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 w-4 h-4 flex items-center justify-center text-[10px]"
                                >
                                    ✕
                                </button>
                                <input
                                    value={concept.text}
                                    onChange={(e) => updateConcept(idx, e.target.value)}
                                    className="text-sm bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                                    placeholder="Concept name..."
                                />
                            </li>
                        ))}
                    </ul>
                    <button onClick={addConcept} className="text-xs font-bold text-blue-500 hover:text-blue-600 mt-4 px-2 py-1">+ Add Concept</button>
                </div>

                {/* Problems & Solutions */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-4 flex items-center gap-2">
                        <span>🔧</span> Bugs / Problems
                    </h2>
                    <div className="space-y-3">
                        {journal.problems.map((problem, idx) => (
                            <div key={problem.id} className="flex flex-row items-center gap-3 p-2 border border-gray-100 rounded-xl group relative">
                                <button
                                    onClick={() => removeProblem(idx)}
                                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                                >
                                    ✕
                                </button>
                                <button
                                    onClick={() => updateProblem(idx, "solved", !problem.solved)}
                                    className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all border-2 ${problem.solved ? "bg-emerald-500 border-none text-white text-xs" : "border-rose-200"
                                        }`}
                                >
                                    {problem.solved && "✓"}
                                </button>
                                <input
                                    value={problem.text}
                                    onChange={(e) => updateProblem(idx, "text", e.target.value)}
                                    className={`text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 ${problem.solved ? "line-through text-gray-400" : "text-gray-800"}`}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={addProblem} className="text-xs font-bold text-emerald-500 hover:text-emerald-600 mt-3 px-2 py-1">+ Add Problem</button>
                </div>
            </div>

            {/* Resources / Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-500 tracking-wide uppercase mb-3 text-center">Resources & Links</h2>
                    <textarea
                        value={journal.resources}
                        onChange={(e) => updateField("resources", e.target.value)}
                        className="w-full text-xs font-medium text-gray-700 bg-blue-50/50 rounded-2xl p-4 border-none outline-none focus:ring-1 focus:ring-blue-100 resize-none min-h-[80px]"
                        placeholder="Paste URLs here..."
                    />
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-500 tracking-wide uppercase mb-3 text-center">Summary</h2>
                    <textarea
                        value={journal.summary}
                        onChange={(e) => updateField("summary", e.target.value)}
                        className="w-full text-xs font-medium text-gray-700 bg-purple-50/50 rounded-2xl p-4 border-none outline-none focus:ring-1 focus:ring-purple-100 resize-none min-h-[80px]"
                        placeholder="Wrap up your thoughts..."
                    />
                </div>
            </div>
        </div>
    );
}
