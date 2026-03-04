import { useState, useMemo } from "react";

/**
 * Budget Tracker Layout — Rupees, light theme matching screenshot
 * - Set Budget input
 * - Remaining clearly shown
 * - Add expense button
 * - Spending Summary w/ pie chart
 */

const CATEGORY_ICONS = {
    food: { emoji: "🍽️", bg: "bg-orange-50", color: "text-orange-600" },
    transport: { emoji: "🚕", bg: "bg-amber-50", color: "text-amber-600" },
    taxi: { emoji: "🚕", bg: "bg-amber-50", color: "text-amber-600" },
    museum: { emoji: "🏛️", bg: "bg-purple-50", color: "text-purple-600" },
    shopping: { emoji: "🛍️", bg: "bg-pink-50", color: "text-pink-600" },
    souvenirs: { emoji: "🎁", bg: "bg-pink-50", color: "text-pink-600" },
    sightseeing: { emoji: "📸", bg: "bg-teal-50", color: "text-teal-600" },
    entertainment: { emoji: "🎭", bg: "bg-indigo-50", color: "text-indigo-600" },
    accommodation: { emoji: "🏨", bg: "bg-amber-50", color: "text-amber-600" },
    other: { emoji: "📦", bg: "bg-gray-100", color: "text-gray-600" },
    default: { emoji: "💰", bg: "bg-emerald-50", color: "text-emerald-600" },
};

function parseExpenseItem(item) {
    const text = typeof item === "string" ? item : item?.text || "";
    const match = text.match(/^(.+?)\s*[-–]\s*₹?([\d.,]+)\s*$/);
    if (match) {
        return { category: match[1].trim(), amount: parseFloat(match[2].replace(",", "")) || 0, raw: text };
    }
    return { category: text, amount: 0, raw: text };
}

function getCategoryIcon(category) {
    const key = category.toLowerCase().trim();
    return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}

const PIE_COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#a78bfa"];

export default function BudgetLayout({ template, blocks, setBlocks }) {
    const textBlocks = blocks.filter((b) => b.type === "text");
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    const notesBlock = textBlocks.length > 1 ? textBlocks[textBlocks.length - 1] : null;
    const budgetPlanBlock = textBlocks[0] || null;

    const [budgetInput, setBudgetInput] = useState("");
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [addingExpense, setAddingExpense] = useState(false);
    const [newExpense, setNewExpense] = useState("");

    const items = checklistBlock?.data?.items || [];
    const expenses = useMemo(() => items.map(parseExpenseItem), [items]);

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

    const budgetText = budgetPlanBlock?.data?.text || "";
    const budgetMatch = budgetText.match(/₹?([\d.,]+)/);
    const totalBudget = budgetMatch ? parseFloat(budgetMatch[1].replace(",", "")) || 0 : 0;
    const remaining = Math.max(0, totalBudget - totalSpent);
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const percentRemaining = 100 - percentUsed;

    const setBudget = () => {
        if (!budgetPlanBlock) return;
        const val = parseFloat(budgetInput.replace(/[^0-9.]/g, ""));
        if (!isNaN(val)) {
            setBlocks((prev) =>
                prev.map((b) =>
                    b.id === budgetPlanBlock.id ? { ...b, data: { text: `Budget: ₹${val.toLocaleString("en-IN")}` } } : b
                )
            );
        }
        setShowBudgetModal(false);
        setBudgetInput("");
    };

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
        if (!newExpense.trim() || !checklistBlock) return;
        const newItems = [...items, { text: newExpense.trim(), checked: false }];
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b
            )
        );
        setNewExpense("");
        setAddingExpense(false);
    };

    const today = new Date();
    const formatExpenseDate = (i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (items.length - 1 - i));
        return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    };

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="py-3 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-extrabold text-gray-900">
                    {template?.name || "Travel Budget Tracker"}
                </h2>
                <button
                    onClick={() => setShowBudgetModal(true)}
                    className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                    Set Budget
                </button>
            </div>

            {/* Set Budget Modal */}
            {showBudgetModal && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowBudgetModal(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Set Total Budget</h3>
                        <p className="text-xs text-gray-400 mb-4">Enter your planned spend in ₹</p>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 mb-4">
                            <span className="text-gray-500 font-black text-xl">₹</span>
                            <input
                                type="number"
                                value={budgetInput}
                                onChange={(e) => setBudgetInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-2xl font-extrabold text-gray-900 focus:ring-0 p-0"
                                placeholder="0"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && setBudget()}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowBudgetModal(false)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm">Cancel</button>
                            <button onClick={setBudget} className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm">Set Budget</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-3xl font-black text-gray-900">
                            {totalBudget > 0 ? `₹${totalBudget.toLocaleString("en-IN")}` : (
                                <button onClick={() => setShowBudgetModal(true)} className="text-base font-bold text-blue-500 hover:underline">
                                    + Set budget
                                </button>
                            )}
                        </p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Total Budget</p>
                    </div>
                    <div className="text-right bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
                        <p className="text-2xl font-black text-emerald-600">
                            ₹{remaining.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5 flex items-center justify-end gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                            Remaining
                        </p>
                    </div>
                </div>

                {totalBudget > 0 && (
                    <>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700"
                                style={{ width: `${Math.min(percentRemaining, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 text-right mt-1.5">{percentRemaining}% Available</p>
                    </>
                )}
            </div>

            {/* Expenses Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Expenses</h3>
                    <button className="text-gray-300 font-black">⋯</button>
                </div>

                <div className="space-y-0">
                    {expenses.map((exp, i) => {
                        const icon = getCategoryIcon(exp.category);
                        return (
                            <div
                                key={i}
                                className="group flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 px-2 -mx-2 rounded-xl transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl ${icon.bg} flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
                                    {icon.emoji}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={exp.raw}
                                        onChange={(e) => updateItem(i, e.target.value)}
                                        className="text-sm font-bold text-gray-800 bg-transparent border-none outline-none w-full focus:ring-0 p-0"
                                        placeholder="Category - ₹0"
                                    />
                                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase">{formatExpenseDate(i)}</p>
                                </div>

                                {exp.amount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-800">
                                            ₹{exp.amount.toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-gray-300">›</span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeExpense(i)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 w-7 h-7 rounded-md flex items-center justify-center transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>

                {addingExpense ? (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <input
                            type="text"
                            value={newExpense}
                            onChange={(e) => setNewExpense(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") addExpense();
                                if (e.key === "Escape") { setAddingExpense(false); setNewExpense(""); }
                            }}
                            className="flex-1 text-sm font-medium text-gray-800 bg-gray-50 rounded-xl px-3 py-2 outline-none border border-gray-200 focus:border-blue-400"
                            placeholder="e.g. Food - ₹450"
                            autoFocus
                        />
                        <button onClick={addExpense} className="text-xs font-bold text-blue-500 px-3 py-2">Add</button>
                        <button onClick={() => { setAddingExpense(false); setNewExpense(""); }} className="text-xs text-gray-400">✕</button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setAddingExpense(true)}
                        className="mt-3 flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 font-bold uppercase tracking-wide transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Add expense
                    </button>
                )}
            </div>

            {/* Spending Summary */}
            {totalSpent > 0 && (
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-5">Spending Summary</h3>

                    <div className="flex items-center gap-6">
                        {/* Donut Chart */}
                        <div className="relative w-28 h-28 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="5" />
                                {expenses.filter(e => e.amount > 0).reduce((acc, exp, i) => {
                                    const pct = (exp.amount / totalSpent) * 100;
                                    const offset = acc.offset;
                                    acc.segments.push(
                                        <circle
                                            key={i}
                                            cx="18" cy="18" r="14"
                                            fill="none"
                                            stroke={PIE_COLORS[i % PIE_COLORS.length]}
                                            strokeWidth="5"
                                            strokeDasharray={`${pct} ${100 - pct}`}
                                            strokeDashoffset={-offset}
                                            strokeLinecap="round"
                                        />
                                    );
                                    acc.offset += pct;
                                    return acc;
                                }, { segments: [], offset: 0 }).segments}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-base font-black text-gray-900 tabular-nums">{percentUsed}%</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="text-right mb-3">
                                <p className="text-xl font-black text-gray-900">₹{remaining.toLocaleString("en-IN")}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</p>
                            </div>
                            <div className="space-y-2">
                                {expenses.filter(e => e.amount > 0).map((exp, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white"
                                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <span className="text-gray-600 font-semibold flex-1 truncate">{exp.category}</span>
                                        <span className="text-gray-800 font-bold">{Math.round((exp.amount / totalSpent) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">₹{totalSpent.toLocaleString("en-IN")} Spent</span>
                    </div>
                </div>
            )}

            {/* Notes */}
            {notesBlock && (
                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <textarea
                        value={notesBlock.data?.text || ""}
                        onChange={(e) =>
                            setBlocks((prev) => prev.map((b) => b.id === notesBlock.id ? { ...b, data: { text: e.target.value } } : b))
                        }
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-700 font-medium placeholder-gray-400 resize-y min-h-[60px] focus:ring-0 p-0"
                        placeholder="Spending notes…"
                    />
                </div>
            )}

            {/* Floating Add */}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() => setAddingExpense(true)}
                    className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white
                     shadow-lg shadow-blue-200 flex items-center justify-center text-2xl
                     transition-all duration-300 active:scale-90"
                >
                    +
                </button>
            </div>
        </div>
    );
}
