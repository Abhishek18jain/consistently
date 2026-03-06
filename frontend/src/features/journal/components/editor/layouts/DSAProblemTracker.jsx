import { useState } from "react";

/**
 * Image 4: DSA Problem Tracker
 */

const DEFAULT_TOPICS = [
    {
        id: "t-1",
        name: "Arrays & Hashing",
        isOpen: true,
        problems: [
            { id: "p-1", title: "Two Sum", difficulty: "Easy", status: "Done", notes: "Use HashMap for O(n)" },
            { id: "p-2", title: "Group Anagrams", difficulty: "Medium", status: "Review", notes: "Sort string or count chars" }
        ]
    },
    {
        id: "t-2",
        name: "Two Pointers",
        isOpen: true,
        problems: [
            { id: "p-3", title: "Valid Palindrome", difficulty: "Easy", status: "Done", notes: "" },
            { id: "p-4", title: "3Sum", difficulty: "Medium", status: "To Do", notes: "Sort first, then two pointer" }
        ]
    }
];

const DIFF_COLORS = {
    "Easy": "bg-emerald-100 text-emerald-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Hard": "bg-rose-100 text-rose-700"
};

const STATUS_COLORS = {
    "To Do": "text-gray-400 border-gray-200",
    "Review": "text-blue-500 border-blue-200 bg-blue-50",
    "Done": "text-emerald-500 border-emerald-500 bg-emerald-500 text-white"
};

export default function DSAProblemTracker({ template, blocks, setBlocks }) {
    const mainBlock = blocks[0] || null;
    const topics = mainBlock?.data?.topics || DEFAULT_TOPICS;

    const saveTopics = (newTopics) => {
        if (!mainBlock) return;
        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, topics: newTopics } } : b));
    };

    const toggleTopic = (idx) => {
        const newTopics = [...topics];
        newTopics[idx].isOpen = !newTopics[idx].isOpen;
        saveTopics(newTopics);
    };

    const updateTopicName = (idx, value) => {
        const newTopics = [...topics];
        newTopics[idx].name = value;
        saveTopics(newTopics);
    };

    const addTopic = () => {
        saveTopics([...topics, { id: `t-${Date.now()}`, name: "New Topic", isOpen: true, problems: [] }]);
    };

    const removeTopic = (idx) => {
        const newTopics = [...topics];
        newTopics.splice(idx, 1);
        saveTopics(newTopics);
    };

    const addProblem = (topicIdx) => {
        const newTopics = [...topics];
        newTopics[topicIdx].problems.push({
            id: `p-${Date.now()}`, title: "New Problem", difficulty: "Medium", status: "To Do", notes: ""
        });
        saveTopics(newTopics);
    };

    const removeProblem = (topicIdx, probIdx) => {
        const newTopics = [...topics];
        newTopics[topicIdx].problems.splice(probIdx, 1);
        saveTopics(newTopics);
    };

    const updateProblem = (topicIdx, probIdx, field, value) => {
        const newTopics = [...topics];
        newTopics[topicIdx].problems[probIdx][field] = value;
        saveTopics(newTopics);
    };

    const cycleDifficulty = (topicIdx, probIdx) => {
        const diffs = ["Easy", "Medium", "Hard"];
        const current = topics[topicIdx].problems[probIdx].difficulty;
        const next = diffs[(diffs.indexOf(current) + 1) % diffs.length];
        updateProblem(topicIdx, probIdx, "difficulty", next);
    };

    const cycleStatus = (topicIdx, probIdx) => {
        const statuses = ["To Do", "Review", "Done"];
        const current = topics[topicIdx].problems[probIdx].status;
        const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
        updateProblem(topicIdx, probIdx, "status", next);
    };

    const totalProblems = topics.reduce((sum, t) => sum + t.problems.length, 0);
    const completedProblems = topics.reduce((sum, t) => sum + t.problems.filter(p => p.status === "Done").length, 0);
    const progress = totalProblems ? Math.round((completedProblems / totalProblems) * 100) : 0;

    return (
        <div className="py-4 space-y-6">
            <input
                value={mainBlock?.data?.title || "DSA Problem Tracker"}
                onChange={(e) => {
                    if (mainBlock) {
                        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, title: e.target.value } } : b));
                    }
                }}
                className="text-2xl font-bold text-gray-900 mb-2 text-center bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Tracker Title"
            />

            {/* Summary */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Solved</p>
                    <p className="text-2xl font-black text-gray-900">{completedProblems} <span className="text-sm font-semibold text-gray-400">/ {totalProblems}</span></p>
                </div>
                <div className="w-1/2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-blue-500">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
                {topics.map((topic, ti) => (
                    <div key={topic.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Topic Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer group transition-colors" onClick={() => toggleTopic(ti)}>
                            <div className="flex items-center gap-2 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                                <span className="text-lg text-gray-400">📂</span>
                                <input
                                    value={topic.name}
                                    onChange={(e) => updateTopicName(ti, e.target.value)}
                                    className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-2/3"
                                    placeholder="Topic Name"
                                />
                                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md ml-2">
                                    {topic.problems.filter(p => p.status === "Done").length}/{topic.problems.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeTopic(ti); }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-2"
                                >
                                    ✕
                                </button>
                                <span className="text-gray-400 font-mono text-xs">
                                    {topic.isOpen ? "−" : "+"}
                                </span>
                            </div>
                        </div>

                        {/* Problems Table */}
                        {topic.isOpen && (
                            <div className="p-2 space-y-1">
                                {topic.problems.map((prob, pi) => (
                                    <div key={prob.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 gap-3 hover:bg-gray-50 rounded-xl group relative border border-transparent hover:border-gray-100">
                                        <button
                                            onClick={() => removeProblem(ti, pi)}
                                            className="absolute left-[-2px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-600 w-4 h-4 flex items-center justify-center text-[10px]"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex items-center gap-3 flex-1 min-w-0 pl-4 md:pl-0">
                                            <button
                                                onClick={() => cycleStatus(ti, pi)}
                                                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${STATUS_COLORS[prob.status]
                                                    }`}
                                            >
                                                {prob.status === "Done" && <span className="text-xs">✓</span>}
                                                {prob.status === "Review" && <span className="text-[10px] font-bold">R</span>}
                                            </button>
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <input
                                                    value={prob.title}
                                                    onChange={(e) => updateProblem(ti, pi, "title", e.target.value)}
                                                    className={`text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 w-full ${prob.status === "Done" ? "text-gray-400" : "text-gray-800"}`}
                                                    placeholder="Problem Title"
                                                />
                                                <input
                                                    value={prob.notes}
                                                    onChange={(e) => updateProblem(ti, pi, "notes", e.target.value)}
                                                    className="text-xs text-gray-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-full italic"
                                                    placeholder="Add notes..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-row items-center justify-end gap-3 pl-12 md:pl-0">
                                            <button
                                                onClick={() => cycleDifficulty(ti, pi)}
                                                className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full w-16 text-center ${DIFF_COLORS[prob.difficulty]}`}
                                            >
                                                {prob.difficulty}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addProblem(ti)}
                                    className="text-xs font-bold text-emerald-500 px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors w-full text-left mt-1"
                                >
                                    + Add Problem
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={addTopic}
                    className="w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm rounded-2xl py-4 hover:border-gray-300 hover:text-gray-800 transition-colors"
                >
                    + Add Topic / Category
                </button>
            </div>
        </div>
    );
}
