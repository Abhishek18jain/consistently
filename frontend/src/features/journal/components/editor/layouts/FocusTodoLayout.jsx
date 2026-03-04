import { useState, useEffect } from "react";

/**
 * Focus Mode Todo Layout — Light theme matching general aesthetic
 * Structural design inspired by Focus Mode Todo mockup.
 */

export default function FocusTodoLayout({ template, blocks, setBlocks }) {
    const textBlocks = blocks.filter((b) => b.type === "text");
    const checklistBlock = blocks.find((b) => b.type === "checklist");

    const titleBlock = textBlocks[0] || null;
    const items = checklistBlock?.data?.items || [];

    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [distractionBlocker, setDistractionBlocker] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const updateBlock = (blockId, newData) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === blockId ? { ...b, data: newData } : b))
        );
    };

    const toggleItem = (idx) => {
        if (!checklistBlock) return;
        const newItems = [...items];
        if (typeof newItems[idx] === "string") {
            newItems[idx] = { text: newItems[idx], checked: true };
        } else {
            newItems[idx] = { ...newItems[idx], checked: !newItems[idx].checked };
        }
        updateBlock(checklistBlock.id, { items: newItems });
    };

    const updateItemText = (idx, text) => {
        if (!checklistBlock) return;
        const newItems = [...items];
        if (typeof newItems[idx] === "string") {
            newItems[idx] = { text, checked: false };
        } else {
            newItems[idx] = { ...newItems[idx], text };
        }
        updateBlock(checklistBlock.id, { items: newItems });
    };

    const addItem = () => {
        if (!checklistBlock) return;
        updateBlock(checklistBlock.id, { items: [...items, { text: "", checked: false }] });
    };

    const removeItem = (idx) => {
        if (!checklistBlock) return;
        updateBlock(checklistBlock.id, { items: items.filter((_, i) => i !== idx) });
    };

    const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
    // SVG Circle properties
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="py-3">
            {/* Top Bar Area */}
            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    Focus Mode Todo
                </h2>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                    ✕
                </button>
            </div>

            {/* Main Task Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm mb-5">
                {titleBlock && (
                    <input
                        type="text"
                        value={titleBlock.data?.text || ""}
                        onChange={(e) => updateBlock(titleBlock.id, { text: e.target.value })}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full focus:ring-0 p-0 mb-6 placeholder-gray-300"
                        placeholder="Focus objective..."
                    />
                )}

                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Subtasks</h3>
                <div className="space-y-1">
                    {items.map((item, i) => {
                        const isChecked = typeof item === "string" ? false : item.checked;
                        const text = typeof item === "string" ? item : item.text;

                        return (
                            <div key={i} className="group flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => toggleItem(i)}
                                    className={`
                    w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0 border-2
                    ${isChecked
                                            ? "bg-gray-800 border-gray-800 text-white"
                                            : "bg-white border-gray-300 hover:border-gray-500"
                                        }
                  `}
                                >
                                    {isChecked && (
                                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => updateItemText(i, e.target.value)}
                                    className={`
                    flex-1 bg-transparent border-none outline-none text-sm p-0 focus:ring-0
                    ${isChecked ? "line-through text-gray-400" : "text-gray-800 font-medium"}
                  `}
                                    placeholder="Task detail..."
                                />
                                <button
                                    type="button"
                                    onClick={() => removeItem(i)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 w-6 h-6 rounded flex items-center justify-center transition-all bg-gray-50"
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={addItem}
                    className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold uppercase tracking-wide transition-colors"
                >
                    <span className="text-lg leading-none">+</span> Add task
                </button>
            </div>

            {/* Pomodoro Timer Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-extrabold text-gray-900">Pomodoro</h3>
                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1">
                        Distraction Blocker <span className="text-gray-400">›</span>
                    </button>
                </div>

                <div className="flex items-center justify-center py-6 relative cursor-pointer" onClick={toggleTimer}>
                    <div className="relative flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        {/* Background Circle */}
                        <svg width="150" height="150" className="transform -rotate-90">
                            <circle
                                cx="75"
                                cy="75"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-orange-50"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="75"
                                cy="75"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="text-orange-500 transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-black text-gray-900 tabular-nums tracking-tight">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {isActive ? "Running" : "Paused"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
                    <span className="text-sm font-bold text-orange-600">Pomodoro</span>
                    <button
                        type="button"
                        onClick={() => setDistractionBlocker(!distractionBlocker)}
                        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${distractionBlocker ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${distractionBlocker ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-sm transition-all active:scale-[0.98]">
                Done for today
            </button>
        </div>
    );
}
