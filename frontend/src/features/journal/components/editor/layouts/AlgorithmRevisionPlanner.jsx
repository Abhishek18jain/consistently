import { useState } from "react";
import dayjs from "dayjs";

/**
 * Image 1: Algorithm Revision Planner
 */

const DEFAULT_CATEGORIES = [
    {
        id: "cat-1",
        title: "Arrays",
        color: "blue",
        isOpen: true,
        items: [
            { id: "i-1", text: "Two Sum", checked: true, dateLabel: "Last Practiced", date: "Apr 20, 2024", difficulty: "Easy" },
            { id: "i-2", text: "Maximum Subarray", checked: false, dateLabel: "Next Revisit", date: "Apr 27, 2024", difficulty: "Medium" }
        ]
    },
    {
        id: "cat-2",
        title: "Binary Trees",
        color: "emerald",
        isOpen: true,
        items: [
            { id: "i-3", text: "Level Order Traversal", checked: false, dateLabel: "Last Practiced", date: "Apr 19, 2024", difficulty: "Medium" }
        ]
    }
];

const DIFF_COLORS = {
    Easy: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-rose-100 text-rose-700"
};

const THEME_COLORS = ["blue", "emerald", "purple", "amber", "rose", "cyan"];

export default function AlgorithmRevisionPlanner({ template, blocks, setBlocks }) {
    const mainBlock = blocks[0] || null;

    // Load data or use defaults
    const categories = mainBlock?.data?.categories || DEFAULT_CATEGORIES;

    const saveCategories = (newCats) => {
        if (!mainBlock) return;
        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, categories: newCats } } : b));
    };

    const toggleOpen = (catIdx) => {
        const newCats = [...categories];
        newCats[catIdx].isOpen = !newCats[catIdx].isOpen;
        saveCategories(newCats);
    };

    const updateCatTitle = (catIdx, value) => {
        const newCats = [...categories];
        newCats[catIdx].title = value;
        saveCategories(newCats);
    };

    const toggleItem = (catIdx, itemIdx) => {
        const newCats = [...categories];
        newCats[catIdx].items[itemIdx].checked = !newCats[catIdx].items[itemIdx].checked;
        saveCategories(newCats);
    };

    const updateItem = (catIdx, itemIdx, field, value) => {
        const newCats = [...categories];
        newCats[catIdx].items[itemIdx][field] = value;
        saveCategories(newCats);
    };

    const cycleDifficulty = (catIdx, itemIdx) => {
        const newCats = [...categories];
        const current = newCats[catIdx].items[itemIdx].difficulty;
        const next = current === "Easy" ? "Medium" : current === "Medium" ? "Hard" : "Easy";
        newCats[catIdx].items[itemIdx].difficulty = next;
        saveCategories(newCats);
    };

    const addItem = (catIdx) => {
        const newCats = [...categories];
        newCats[catIdx].items.push({
            id: `i-${Date.now()}`,
            text: "New algorithm",
            checked: false,
            dateLabel: "Next Revisit",
            date: dayjs().format("MMM D, YYYY"),
            difficulty: "Medium"
        });
        saveCategories(newCats);
    };

    const addCategory = () => {
        const newCats = [...categories, {
            id: `cat-${Date.now()}`,
            title: "New Topic",
            color: THEME_COLORS[categories.length % THEME_COLORS.length],
            isOpen: true,
            items: []
        }];
        saveCategories(newCats);
    };

    const removeCategory = (catIdx) => {
        const newCats = categories.filter((_, i) => i !== catIdx);
        saveCategories(newCats);
    };

    const removeItem = (catIdx, itemIdx) => {
        const newCats = [...categories];
        newCats[catIdx].items.splice(itemIdx, 1);
        saveCategories(newCats);
    };

    const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
    const checkedItems = categories.reduce((sum, c) => sum + c.items.filter(i => i.checked).length, 0);
    const progress = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0;

    return (
        <div className="py-4">
            <input
                value={mainBlock?.data?.title || "Algorithm Revision Planner"}
                onChange={(e) => {
                    if (mainBlock) {
                        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, title: e.target.value } } : b));
                    }
                }}
                className="text-2xl font-bold text-gray-900 mb-6 text-center bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Planner Title"
            />

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Revision Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                {categories.map((cat, ci) => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className={`flex items-center justify-between p-4 bg-${cat.color}-50 cursor-pointer group`} onClick={() => toggleOpen(ci)}>
                            <div className="flex items-center gap-3 flex-1" onClick={(e) => e.stopPropagation()}>
                                <span className={`text-lg text-${cat.color}-500`}>🗂️</span>
                                <input
                                    value={cat.title}
                                    onChange={(e) => updateCatTitle(ci, e.target.value)}
                                    className={`text-sm font-bold text-${cat.color}-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-1/2`}
                                />
                                <button
                                    onClick={() => removeCategory(ci)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-2"
                                >
                                    ✕
                                </button>
                            </div>
                            <span className="text-gray-400">
                                {cat.isOpen ? "▲" : "▼"}
                            </span>
                        </div>

                        {/* Items */}
                        {cat.isOpen && (
                            <div className="p-2 space-y-1">
                                {cat.items.map((item, ii) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 hover:bg-gray-50 rounded-xl group relative">
                                        <button
                                            onClick={() => removeItem(ci, ii)}
                                            className="absolute left-[-5px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 w-4 h-4 flex items-center justify-center text-[10px]"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <button
                                                onClick={() => toggleItem(ci, ii)}
                                                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${item.checked ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"
                                                    }`}
                                            >
                                                {item.checked && <span className="text-xs">✓</span>}
                                            </button>
                                            <input
                                                value={item.text}
                                                onChange={(e) => updateItem(ci, ii, "text", e.target.value)}
                                                className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-semibold pl-8 sm:pl-0 sm:ml-auto">
                                            <div className="flex flex-col items-end">
                                                <input
                                                    value={item.dateLabel}
                                                    onChange={(e) => updateItem(ci, ii, "dateLabel", e.target.value)}
                                                    className="text-[10px] text-gray-400 text-right bg-transparent border-none outline-none focus:ring-0 p-0 w-24"
                                                />
                                                <input
                                                    value={item.date}
                                                    onChange={(e) => updateItem(ci, ii, "date", e.target.value)}
                                                    className="text-gray-600 text-right bg-transparent border-none outline-none focus:ring-0 p-0 w-24"
                                                />
                                            </div>
                                            <button
                                                onClick={() => cycleDifficulty(ci, ii)}
                                                className={`px-3 py-1 rounded-full ${DIFF_COLORS[item.difficulty]}`}
                                            >
                                                {item.difficulty}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addItem(ci)}
                                    className="text-xs font-bold text-blue-500 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
                                >
                                    + Add Item
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={addCategory}
                    className="w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm rounded-2xl py-4 hover:border-gray-300 hover:text-gray-700 transition-colors"
                >
                    + Add Topic
                </button>
            </div>
        </div>
    );
}
