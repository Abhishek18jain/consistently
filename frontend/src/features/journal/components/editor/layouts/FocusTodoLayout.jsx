import { useMemo, useState } from "react";

/**
 * Focus Mode Todo Layout — fully dark theme
 */

const PRIORITY_LEVELS = [
    {
        label: "Must Do",
        emoji: "🎯",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        labelColor: "text-red-400",
        checkColor: "bg-red-500 border-red-500",
        tagBg: "bg-red-500/20 text-red-400",
    },
    {
        label: "Should Do",
        emoji: "📌",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        labelColor: "text-amber-400",
        checkColor: "bg-amber-500 border-amber-500",
        tagBg: "bg-amber-500/20 text-amber-400",
    },
    {
        label: "Could Do",
        emoji: "💡",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        labelColor: "text-blue-400",
        checkColor: "bg-blue-500 border-blue-500",
        tagBg: "bg-blue-500/20 text-blue-400",
    },
];

function parsePriorities(blocks) {
    const priorities = [];
    let current = null;

    for (const block of blocks) {
        if (block.type === "text") {
            if (current) priorities.push(current);
            current = { title: block.data?.text || "", items: [], titleBlockId: block.id };
        } else if (block.type === "checklist" && current) {
            current.items = (block.data?.items || []).map((item) =>
                typeof item === "string"
                    ? { text: item, checked: false }
                    : { text: item.text || "", checked: !!item.checked }
            );
            current.checklistBlockId = block.id;
        }
    }
    if (current) priorities.push(current);

    while (priorities.length < 3) {
        priorities.push({
            title: PRIORITY_LEVELS[priorities.length]?.label || "",
            items: [],
        });
    }

    return priorities.slice(0, 3);
}

export default function FocusTodoLayout({ template, blocks, setBlocks }) {
    const priorities = parsePriorities(blocks);
    const [focusMinutes, setFocusMinutes] = useState(25);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const updatePriorityItems = (prIdx, newItems) => {
        const pr = priorities[prIdx];
        if (!pr?.checklistBlockId) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === pr.checklistBlockId
                    ? { ...b, data: { items: newItems } }
                    : b
            )
        );
    };

    const toggleItem = (prIdx, itemIdx) => {
        const items = [...priorities[prIdx].items];
        items[itemIdx] = { ...items[itemIdx], checked: !items[itemIdx].checked };
        updatePriorityItems(prIdx, items);
    };

    const updateItemText = (prIdx, itemIdx, text) => {
        const items = [...priorities[prIdx].items];
        items[itemIdx] = { ...items[itemIdx], text };
        updatePriorityItems(prIdx, items);
    };

    const addItem = (prIdx) => {
        const items = [...priorities[prIdx].items, { text: "", checked: false }];
        updatePriorityItems(prIdx, items);
    };

    const removeItem = (prIdx, itemIdx) => {
        const items = priorities[prIdx].items.filter((_, i) => i !== itemIdx);
        updatePriorityItems(prIdx, items);
    };

    const totalTasks = priorities.reduce((sum, p) => sum + p.items.length, 0);
    const completedTasks = priorities.reduce((sum, p) => sum + p.items.filter(i => i.checked).length, 0);
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="py-3">
            <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                    {template?.name || "Focus Mode"} 🎯
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Stay focused, get things done"}
                </p>
            </div>

            {/* Focus Timer Card */}
            <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700/50 mb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Focus Session</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-zinc-100 tabular-nums">{focusMinutes}</span>
                            <span className="text-sm text-zinc-400">min</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFocusMinutes(Math.max(5, focusMinutes - 5))}
                            className="w-8 h-8 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600
                         flex items-center justify-center text-sm transition-colors"
                        >
                            −
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsTimerActive(!isTimerActive)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95
                ${isTimerActive
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                }`}
                        >
                            {isTimerActive ? "Stop" : "Start"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFocusMinutes(Math.min(120, focusMinutes + 5))}
                            className="w-8 h-8 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600
                         flex items-center justify-center text-sm transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {totalTasks > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-700/50">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-zinc-500">Progress</span>
                            <span className="text-xs font-medium text-zinc-300">{completedTasks}/{totalTasks} done</span>
                        </div>
                        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Priority Sections */}
            <div className="space-y-4">
                {priorities.map((pr, pi) => {
                    const style = PRIORITY_LEVELS[pi];
                    return (
                        <div
                            key={pi}
                            className={`rounded-2xl border ${style.border} overflow-hidden bg-zinc-800/40`}
                        >
                            <div className={`${style.bg} px-4 py-3 flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{style.emoji}</span>
                                    <h4 className={`text-sm font-semibold ${style.labelColor}`}>
                                        {style.label}
                                    </h4>
                                </div>
                                {pr.items.length > 0 && (
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.tagBg}`}>
                                        {pr.items.filter(i => i.checked).length}/{pr.items.length}
                                    </span>
                                )}
                            </div>

                            <div className="px-4 py-2">
                                {pr.items.map((item, ii) => (
                                    <div
                                        key={ii}
                                        className="group flex items-center gap-3 py-2.5 border-b border-zinc-700/30 last:border-b-0"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(pi, ii)}
                                            className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-2
                        flex items-center justify-center transition-all
                        ${item.checked
                                                    ? `${style.checkColor} text-white`
                                                    : "border-zinc-500 bg-zinc-700/50 hover:border-zinc-400"
                                                }
                      `}
                                        >
                                            {item.checked && (
                                                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => updateItemText(pi, ii, e.target.value)}
                                            className={`
                        flex-1 bg-transparent border-none outline-none text-sm
                        ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}
                      `}
                                            placeholder="Add task…"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem(pi, ii)}
                                            className="opacity-0 group-hover:opacity-100 text-zinc-500
                                 hover:text-red-400 text-xs transition-all"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addItem(pi)}
                                    className={`flex items-center gap-1 text-xs font-medium py-2 transition-colors ${style.labelColor} opacity-70 hover:opacity-100`}
                                >
                                    <span className="text-sm">+</span> Add task
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
