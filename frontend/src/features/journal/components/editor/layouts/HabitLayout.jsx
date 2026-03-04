import { useMemo } from "react";

/**
 * Habit Tracker Layout — light theme
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HABIT_COLORS = [
    { ring: "border-emerald-200", fill: "bg-emerald-500", text: "text-emerald-700", tag: "bg-emerald-100 text-emerald-700 font-bold" },
    { ring: "border-orange-200", fill: "bg-orange-500", text: "text-orange-700", tag: "bg-orange-100 text-orange-700 font-bold" },
    { ring: "border-blue-200", fill: "bg-blue-500", text: "text-blue-700", tag: "bg-blue-100 text-blue-700 font-bold" },
    { ring: "border-purple-200", fill: "bg-purple-500", text: "text-purple-700", tag: "bg-purple-100 text-purple-700 font-bold" },
    { ring: "border-rose-200", fill: "bg-rose-500", text: "text-rose-700", tag: "bg-rose-100 text-rose-700 font-bold" },
    { ring: "border-teal-200", fill: "bg-teal-500", text: "text-teal-700", tag: "bg-teal-100 text-teal-700 font-bold" },
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
                <h2 className="text-xl font-bold text-gray-900">
                    {template?.name || "Habit Planner"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    {template?.description || "Track your daily habits"}
                </p>
            </div>

            <div className="flex items-center justify-between mb-4 px-1 border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Habit List</h3>
                <span className="text-xs font-semibold text-gray-400">{habits.length} habits</span>
            </div>

            <div className="space-y-4">
                {habits.map((habit, hi) => {
                    const color = HABIT_COLORS[hi % HABIT_COLORS.length];
                    const daysCompleted = Object.values(habit.days).filter(Boolean).length;

                    return (
                        <div
                            key={hi}
                            className="bg-white shadow-sm rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <input
                                    type="text"
                                    value={habit.text}
                                    onChange={(e) => updateHabitName(hi, e.target.value)}
                                    className="font-bold text-sm text-gray-900 bg-transparent border-none outline-none flex-1 focus:ring-0 p-0"
                                    placeholder="Habit name…"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeHabit(hi)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-6 h-6 rounded-md flex items-center justify-center transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            {daysCompleted > 0 && (
                                <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide ${color.tag}`}>
                                    {daysCompleted} / 7 Days
                                </span>
                            )}

                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                                {DAYS.map((day) => {
                                    const dayKey = day.toLowerCase();
                                    const isActive = !!habit.days[dayKey];

                                    return (
                                        <div key={day} className="flex flex-col items-center gap-1.5">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                {day}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleDay(hi, day)}
                                                className={`
                          w-8 h-8 rounded-full border-2 flex items-center justify-center
                          transition-all duration-300 active:scale-90 cursor-pointer
                          ${isActive
                                                        ? `${color.fill} border-transparent text-white shadow-md shadow-${color.fill.replace('bg-', '')}/30`
                                                        : `bg-gray-50 hover:bg-gray-100 ${color.ring}`
                                                    }
                        `}
                                            >
                                                {isActive && (
                                                    <svg className="w-4 h-4" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                className="mt-5 w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-300
                   text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:border-gray-400
                   hover:text-gray-800 transition-all flex items-center justify-center gap-2"
            >
                <span className="text-xl leading-none font-medium">+</span> Add Habit
            </button>

            {totalChecked > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 bg-orange-50 border border-orange-100 py-2.5 px-4 rounded-xl mx-auto w-max">
                    <span className="text-xl">🔥</span>
                    <span className="font-semibold">Weekly Streak</span>
                    <span className="font-bold text-orange-600">{totalChecked} completed</span>
                </div>
            )}
        </div>
    );
}
