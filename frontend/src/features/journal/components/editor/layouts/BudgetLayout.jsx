import { useMemo } from "react";

/**
 * Budget Tracker Layout — fully dark theme
 */

const CATEGORY_ICONS = {
    food: { emoji: "🍽️", bg: "bg-orange-500/20", color: "text-orange-400" },
    transport: { emoji: "🚕", bg: "bg-blue-500/20", color: "text-blue-400" },
    taxi: { emoji: "🚕", bg: "bg-blue-500/20", color: "text-blue-400" },
    museum: { emoji: "🏛️", bg: "bg-purple-500/20", color: "text-purple-400" },
    shopping: { emoji: "🛍️", bg: "bg-pink-500/20", color: "text-pink-400" },
    souvenirs: { emoji: "🎁", bg: "bg-pink-500/20", color: "text-pink-400" },
    sightseeing: { emoji: "📸", bg: "bg-teal-500/20", color: "text-teal-400" },
    entertainment: { emoji: "🎭", bg: "bg-indigo-500/20", color: "text-indigo-400" },
    accommodation: { emoji: "🏨", bg: "bg-amber-500/20", color: "text-amber-400" },
    other: { emoji: "📦", bg: "bg-zinc-600/30", color: "text-zinc-400" },
    default: { emoji: "💰", bg: "bg-emerald-500/20", color: "text-emerald-400" },
};

function parseExpenseItem(item) {
    const text = typeof item === "string" ? item : item?.text || "";
    const match = text.match(/^(.+?)\s*[-–]\s*\$?([\d.,]+)\s*$/);
    if (match) {
        return { category: match[1].trim(), amount: parseFloat(match[2].replace(",", "")) || 0, raw: text };
    }
    return { category: text, amount: 0, raw: text };
}

function getCategoryIcon(category) {
    const key = category.toLowerCase().trim();
    return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];

export default function BudgetLayout({ template, blocks, setBlocks }) {
    const textBlocks = blocks.filter((b) => b.type === "text");
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    const notesBlock = textBlocks.length > 1 ? textBlocks[textBlocks.length - 1] : null;
    const budgetPlanBlock = textBlocks[0] || null;

    const items = checklistBlock?.data?.items || [];
    const expenses = useMemo(() => items.map(parseExpenseItem), [items]);

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

    const budgetText = budgetPlanBlock?.data?.text || "";
    const budgetMatch = budgetText.match(/\$?([\d.,]+)/);
    const totalBudget = budgetMatch ? parseFloat(budgetMatch[1].replace(",", "")) || 0 : 0;
    const remaining = Math.max(0, totalBudget - totalSpent);
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const percentRemaining = 100 - percentUsed;

    const updateItem = (i, newText) => {
        if (!checklistBlock) return;
        const newItems = [...items];
        if (typeof newItems[i] === "string") {
            newItems[i] = newText;
        } else {
            newItems[i] = { ...newItems[i], text: newText };
        }
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b
            )
        );
    };

    const removeExpense = (i) => {
        if (!checklistBlock) return;
        const newItems = items.filter((_, idx) => idx !== i);
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b
            )
        );
    };

    const addExpense = () => {
        if (!checklistBlock) return;
        const newItems = [...items, typeof items[0] === "string" ? "Item - $0" : { text: "Item - $0", checked: false }];
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b
            )
        );
    };

    const updateBudgetPlan = (text) => {
        if (!budgetPlanBlock) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === budgetPlanBlock.id ? { ...b, data: { text } } : b
            )
        );
    };

    const updateNotes = (text) => {
        if (!notesBlock) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === notesBlock.id ? { ...b, data: { text } } : b
            )
        );
    };

    const today = new Date();
    const formatExpenseDate = (i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="py-3">
            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-zinc-100">
                    {template?.name || "Budget Tracker"}
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Track expenses and budget"}
                </p>
            </div>

            {/* Budget Summary Card */}
            <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700/50 mb-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <input
                            type="text"
                            value={budgetPlanBlock?.data?.text || ""}
                            onChange={(e) => updateBudgetPlan(e.target.value)}
                            className="text-2xl font-bold text-zinc-100 bg-transparent border-none outline-none w-full"
                            placeholder="$2,000"
                        />
                        <p className="text-xs text-zinc-500 mt-0.5">Total Budget</p>
                    </div>
                    <div className="text-right bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                        <p className="text-2xl font-bold text-emerald-400">
                            ${remaining.toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 flex items-center justify-end gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            Remaining
                        </p>
                    </div>
                </div>

                {totalBudget > 0 && (
                    <div>
                        <div className="h-2.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-500"
                                style={{ width: `${Math.min(percentRemaining, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-zinc-500 text-right mt-1">{percentRemaining}%</p>
                    </div>
                )}
            </div>

            {/* Expenses Card */}
            <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700/50 mb-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-zinc-200">Expenses</h3>
                    <button className="text-zinc-500 hover:text-zinc-300 text-lg">⋯</button>
                </div>

                <div className="space-y-1">
                    {expenses.map((exp, i) => {
                        const icon = getCategoryIcon(exp.category);
                        return (
                            <div
                                key={i}
                                className="group flex items-center gap-3 py-3 border-b border-zinc-700/40 last:border-b-0"
                            >
                                <div className={`w-10 h-10 rounded-xl ${icon.bg} flex items-center justify-center text-lg`}>
                                    {icon.emoji}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={exp.raw}
                                        onChange={(e) => updateItem(i, e.target.value)}
                                        className="text-sm font-medium text-zinc-200 bg-transparent border-none outline-none w-full"
                                        placeholder="Category - $0"
                                    />
                                    <p className="text-xs text-zinc-500 mt-0.5">{formatExpenseDate(i)}</p>
                                </div>

                                {exp.amount > 0 && (
                                    <span className="text-sm font-bold text-zinc-200">
                                        ${exp.amount.toLocaleString()}
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeExpense(i)}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 text-xs transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={addExpense}
                    className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                    <span className="text-base">+</span> Add expense
                </button>
            </div>

            {/* Spending Summary */}
            {totalSpent > 0 && (
                <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700/50 mb-5">
                    <h3 className="text-base font-semibold text-zinc-200 mb-4">Spending Summary</h3>

                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                {expenses.filter(e => e.amount > 0).reduce((acc, exp, i) => {
                                    const pct = (exp.amount / totalSpent) * 100;
                                    const offset = acc.offset;
                                    acc.segments.push(
                                        <circle
                                            key={i}
                                            cx="18" cy="18" r="14"
                                            fill="none"
                                            stroke={PIE_COLORS[i % PIE_COLORS.length]}
                                            strokeWidth="6"
                                            strokeDasharray={`${pct} ${100 - pct}`}
                                            strokeDashoffset={-offset}
                                        />
                                    );
                                    acc.offset += pct;
                                    return acc;
                                }, { segments: [], offset: 0 }).segments}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-zinc-300">{percentUsed}%</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-xl font-bold text-zinc-100">${remaining.toLocaleString()}</span>
                                <span className="text-xs text-zinc-500">Remaining</span>
                            </div>
                            <div className="space-y-2">
                                {expenses.filter(e => e.amount > 0).map((exp, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                                        />
                                        <span className="text-zinc-400 flex-1 truncate">{exp.category}</span>
                                        <span className="text-zinc-300 font-semibold">
                                            {Math.round((exp.amount / totalSpent) * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-700/40 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-zinc-100">${totalSpent.toLocaleString()}</span>
                        <span className="text-sm text-zinc-400">Spent</span>
                    </div>
                </div>
            )}

            {/* Notes */}
            {notesBlock && (
                <div className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50">
                    <textarea
                        value={notesBlock.data?.text || ""}
                        onChange={(e) => updateNotes(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 placeholder-zinc-500 resize-y min-h-[60px]"
                        placeholder="Spending notes…"
                    />
                </div>
            )}

            {/* Floating add button */}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={addExpense}
                    className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all active:scale-90"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
