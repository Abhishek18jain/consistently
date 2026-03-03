import { useMemo } from "react";

/**
 * Habit Tracker Layout — fully dark theme
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HABIT_COLORS = [
    { ring: "border-emerald-500/50", fill: "bg-emerald-500", text: "text-emerald-400", tag: "bg-emerald-500/20 text-emerald-400" },
    { ring: "border-orange-500/50", fill: "bg-orange-500", text: "text-orange-400", tag: "bg-orange-500/20 text-orange-400" },
    { ring: "border-blue-500/50", fill: "bg-blue-500", text: "text-blue-400", tag: "bg-blue-500/20 text-blue-400" },
    { ring: "border-purple-500/50", fill: "bg-purple-500", text: "text-purple-400", tag: "bg-purple-500/20 text-purple-400" },
    { ring: "border-rose-500/50", fill: "bg-rose-500", text: "text-rose-400", tag: "bg-rose-500/20 text-rose-400" },
    { ring: "border-teal-500/50", fill: "bg-teal-500", text: "text-teal-400", tag: "bg-teal-500/20 text-teal-400" },
];

export default function HabitLayout({ template, blocks, setBlocks }) {
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    const items = checklistBlock?.data?.items || [];

    const habits = useMemo(() =>
        items.map((item) => {
            if (typeof item === "string") {
                return { text: item, checked: false, days: {} };
            }
            return {
                text: item.text || "",
                checked: !!item.checked,
                days: item.days || {},
            };
        }), [items]
    );

    const updateHabits = (newHabits) => {
        if (!checklistBlock) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id
                    ? { ...b, data: { items: newHabits } }
                    : b
            )
        );
    };

    const toggleDay = (habitIdx, day) => {
        const updated = [...habits];
        const dayKey = day.toLowerCase();
        updated[habitIdx] = {
            ...updated[habitIdx],
            days: {
                ...updated[habitIdx].days,
                [dayKey]: !updated[habitIdx].days[dayKey],
            },
        };
        updateHabits(updated);
    };

    const updateHabitName = (habitIdx, text) => {
        const updated = [...habits];
        updated[habitIdx] = { ...updated[habitIdx], text };
        updateHabits(updated);
    };

    const addHabit = () => {
        updateHabits([...habits, { text: "", checked: false, days: {} }]);
    };

    const removeHabit = (idx) => {
        updateHabits(habits.filter((_, i) => i !== idx));
    };

    const totalChecked = habits.reduce((sum, h) => {
        return sum + Object.values(h.days).filter(Boolean).length;
    }, 0);

    return (
        <div className="py-3">
            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-zinc-100">
                    {template?.name || "Habit Planner"}
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Track your daily habits"}
                </p>
            </div>

            <h3 className="text-sm font-semibold text-zinc-300 mb-4 px-1">Habit List</h3>

            <div className="space-y-3">
                {habits.map((habit, hi) => {
                    const color = HABIT_COLORS[hi % HABIT_COLORS.length];
                    const daysCompleted = Object.values(habit.days).filter(Boolean).length;

                    return (
                        <div
                            key={hi}
                            className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <input
                                    type="text"
                                    value={habit.text}
                                    onChange={(e) => updateHabitName(hi, e.target.value)}
                                    className="font-semibold text-sm text-zinc-100 bg-transparent border-none outline-none flex-1"
                                    placeholder="Habit name…"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeHabit(hi)}
                                    className="text-zinc-500 hover:text-red-400 text-xs p-1 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {daysCompleted > 0 && (
                                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md mb-3 ${color.tag}`}>
                                    {daysCompleted}d
                                </span>
                            )}

                            <div className="flex items-center justify-between mt-1">
                                {DAYS.map((day) => {
                                    const dayKey = day.toLowerCase();
                                    const isActive = !!habit.days[dayKey];

                                    return (
                                        <div key={day} className="flex flex-col items-center gap-1.5">
                                            <span className="text-[10px] text-zinc-500 font-medium">
                                                {day}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleDay(hi, day)}
                                                className={`
                          w-7 h-7 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200 active:scale-90
                          ${isActive
                                                        ? `${color.fill} border-transparent text-white`
                                                        : `bg-zinc-700/50 ${color.ring}`
                                                    }
                        `}
                                            >
                                                {isActive && (
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={addHabit}
                className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-zinc-700
                   text-sm font-medium text-zinc-500 hover:border-blue-500/50
                   hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
            >
                <span className="text-lg leading-none">+</span> Add Habit
            </button>

            {totalChecked > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-400">
                    <span>🔥</span>
                    <span className="font-medium">Current Streak</span>
                    <span className="font-bold text-zinc-200">{totalChecked} days</span>
                </div>
            )}
        </div>
    );
}
