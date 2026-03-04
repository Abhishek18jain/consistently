import { useState } from "react";

/**
 * Goal Planner Layout - Light theme
 * Matching Image 3 design
 */

export default function GoalPlannerLayout({ template, blocks, setBlocks }) {
    const checklistBlocks = blocks.filter((b) => b.type === "checklist");
    const textBlocks = blocks.filter((b) => b.type === "text");

    const stepsBlock = checklistBlocks[0] || null;
    const deadlineBlock = textBlocks[0] || null;
    const titleBlock = textBlocks[1] || null; // Could map differently based on seed

    const steps = stepsBlock?.data?.items || [
        { text: "Conduct market research", checked: true },
        { text: "Define unique value proposition", checked: true },
        { text: "Build product prototype", checked: false },
        { text: "Create marketing plan", checked: false },
        { text: "Launch product website", checked: false }
    ];

    const [goalTitle, setGoalTitle] = useState("Launch New Product");
    const [dueDate, setDueDate] = useState("Sep 30, 2024");

    const completedSteps = steps.filter(s => (typeof s === "string" ? false : s.checked)).length;
    const totalSteps = steps.length;
    const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const updateBlock = (blockId, newData) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === blockId ? { ...b, data: newData } : b))
        );
    };

    const toggleStep = (idx) => {
        if (!stepsBlock) return;
        const newItems = [...steps];
        if (typeof newItems[idx] === "string") {
            newItems[idx] = { text: newItems[idx], checked: true };
        } else {
            newItems[idx] = { ...newItems[idx], checked: !newItems[idx].checked };
        }
        updateBlock(stepsBlock.id, { items: newItems });
    };

    const updateStepText = (idx, text) => {
        if (!stepsBlock) return;
        const newItems = [...steps];
        if (typeof newItems[idx] === "string") {
            newItems[idx] = { text, checked: false };
        } else {
            newItems[idx] = { ...newItems[idx], text };
        }
        updateBlock(stepsBlock.id, { items: newItems });
    };

    // SVG Circle properties
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="py-3 relative min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <button className="text-gray-400 text-lg hover:text-gray-700">‹</button>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Goal Planner
                </h2>
                <button className="text-blue-500 text-xl font-medium hover:text-blue-600">+</button>
            </div>

            {/* Hero Goal Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                        <input
                            type="text"
                            value={titleBlock?.data?.text || goalTitle}
                            onChange={(e) => {
                                setGoalTitle(e.target.value);
                                if (titleBlock) updateBlock(titleBlock.id, { text: e.target.value });
                            }}
                            className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                            placeholder="Goal title..."
                        />
                        <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-gray-500">
                            <span>Due</span>
                            <input
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-transparent border-none p-0 min-w-0"
                            />
                            <span className="text-gray-400">📅</span>
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative flex items-center justify-center shrink-0">
                        <svg width="84" height="84" className="transform -rotate-90">
                            <circle
                                cx="42"
                                cy="42"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-blue-50"
                            />
                            <circle
                                cx="42"
                                cy="42"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="text-teal-400 transition-all duration-1000 ease-in-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-black text-gray-900 tabular-nums">{percent}%</span>
                        </div>
                    </div>
                </div>

                {/* Small straight progress bar below */}
                <div className="h-1.5 w-3/5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-300 rounded-full" style={{ width: `${percent}%` }} />
                </div>
            </div>

            {/* Steps List */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Steps</h3>
                    <p className="text-xs font-semibold text-gray-500 mb-3">{completedSteps} of {totalSteps} completed</p>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                </div>

                <div className="space-y-1">
                    {steps.map((step, i) => {
                        const isChecked = typeof step === "string" ? false : step.checked;
                        const text = typeof step === "string" ? step : step.text;

                        return (
                            <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => toggleStep(i)}
                                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${isChecked ? "bg-emerald-100 text-emerald-500" : "border-2 border-gray-200"
                                        }`}
                                >
                                    {isChecked && (
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => updateStepText(i, e.target.value)}
                                    className={`flex-1 bg-transparent border-none outline-none text-sm p-0 focus:ring-0 ${isChecked ? "text-gray-400 line-through" : "text-gray-800 font-semibold"
                                        }`}
                                />
                                <span className="text-gray-300 text-lg leading-none cursor-move">⋮⋮</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Deadline info */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-20 bg-gradient-to-b from-white to-blue-50/30">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Deadline</h3>
                    <span className="text-sm font-semibold text-gray-600">{dueDate}</span>
                </div>
                <textarea
                    value={deadlineBlock?.data?.text || "• Beta test with selected users\n• Prepare launch event"}
                    onChange={(e) => {
                        if (deadlineBlock) updateBlock(deadlineBlock.id, { text: e.target.value });
                    }}
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-600 font-medium placeholder-gray-400 min-h-[60px] resize-none focus:ring-0 p-0"
                />
            </div>

            {/* Floating Add Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-blue-200 transition-transform active:scale-95">
                    +
                </button>
            </div>
        </div>
    );
}
