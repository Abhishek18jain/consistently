import { useState, useMemo } from "react";

/**
 * Packing List Layout — Exactly matching screenshot
 * 2-column grid for small categories, full-width for large ones
 * Header shows "X / Y Items" with progress bar
 */

const CATEGORY_COLORS = [
    { bg: "bg-rose-50", border: "border-rose-200", title: "text-rose-700", checkBg: "bg-rose-500", headerBg: "bg-rose-50" },
    { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700", checkBg: "bg-blue-500", headerBg: "bg-blue-50" },
    { bg: "bg-amber-50", border: "border-amber-200", title: "text-amber-700", checkBg: "bg-amber-500", headerBg: "bg-amber-50" },
    { bg: "bg-emerald-50", border: "border-emerald-200", title: "text-emerald-700", checkBg: "bg-emerald-500", headerBg: "bg-emerald-50" },
    { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-700", checkBg: "bg-purple-500", headerBg: "bg-purple-50" },
    { bg: "bg-teal-50", border: "border-teal-200", title: "text-teal-700", checkBg: "bg-teal-500", headerBg: "bg-teal-50" },
];

function normalizeItems(items) {
    return (items || []).map((item) => {
        if (typeof item === "string") return { text: item, checked: false, category: "" };
        return { text: item?.text || "", checked: !!item?.checked, category: item?.category || "" };
    });
}

function groupByCategory(items) {
    const groups = {};
    const order = [];
    for (const item of items) {
        const cat = item.category || "Items";
        if (!groups[cat]) {
            groups[cat] = [];
            order.push(cat);
        }
        groups[cat].push(item);
    }
    return order.map((cat) => ({ name: cat, items: groups[cat] }));
}

export default function PackingListLayout({ template, blocks, setBlocks }) {
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    const rawItems = checklistBlock?.data?.items || [];
    const items = useMemo(() => normalizeItems(rawItems), [rawItems]);
    const groups = useMemo(() => groupByCategory(items), [items]);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    const totalItems = items.length;
    const checkedItems = items.filter((i) => i.checked).length;
    const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    const updateItems = (newItems) => {
        if (!checklistBlock) return;
        setBlocks((prev) =>
            prev.map((b) => (b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b))
        );
    };

    const getGlobalIdx = (category, localIdx) => {
        let count = 0;
        for (const g of groups) {
            if (g.name === category) return count + localIdx;
            count += g.items.length;
        }
        return localIdx;
    };

    const toggleItem = (category, localIdx) => {
        const idx = getGlobalIdx(category, localIdx);
        const updated = [...items];
        updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
        updateItems(updated);
    };

    const updateItemText = (category, localIdx, text) => {
        const idx = getGlobalIdx(category, localIdx);
        const updated = [...items];
        updated[idx] = { ...updated[idx], text };
        updateItems(updated);
    };

    const removeItem = (category, localIdx) => {
        const idx = getGlobalIdx(category, localIdx);
        updateItems(items.filter((_, i) => i !== idx));
    };

    const addItem = (categoryName) => {
        updateItems([...items, { text: "", checked: false, category: categoryName }]);
    };

    const addCategory = () => {
        if (!newCategoryName.trim()) return;
        updateItems([...items, { text: "", checked: false, category: newCategoryName.trim() }]);
        setNewCategoryName("");
        setShowCategoryInput(false);
    };

    // Layout: pairs of ≤4 item groups go side by side, larger full width
    const rows = useMemo(() => {
        const result = [];
        let i = 0;
        while (i < groups.length) {
            const g = groups[i];
            const next = groups[i + 1];
            if (g.items.length <= 4 && next && next.items.length <= 4) {
                result.push([g, next]);
                i += 2;
            } else {
                result.push([g]);
                i++;
            }
        }
        return result;
    }, [groups]);

    return (
        <div className="py-3 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-extrabold text-gray-900">
                    {template?.name || "Packing List"} 🗺️
                </h2>
                <button
                    onClick={() => setShowCategoryInput(true)}
                    className="text-xl text-blue-500 font-medium hover:text-blue-700"
                >
                    +
                </button>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm mb-5">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">{checkedItems} / {totalItems}</span>
                    <span className="text-sm font-semibold text-gray-500">Items</span>
                    <span className="ml-auto text-xs font-bold text-gray-400">{percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                {rows.map((row, ri) => (
                    <div key={ri} className={row.length === 2 ? "grid grid-cols-2 gap-3" : ""}>
                        {row.map((group) => {
                            const colorIdx = groups.indexOf(group);
                            const color = CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length];

                            return (
                                <div
                                    key={group.name}
                                    className={`rounded-2xl border ${color.border} ${color.bg} overflow-hidden shadow-sm`}
                                >
                                    {/* Category Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <h4 className={`text-sm font-bold ${color.title}`}>{group.name}</h4>
                                        <button className="text-gray-400 hover:text-gray-700 text-sm">⋯</button>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-white px-4 py-2">
                                        {group.items.map((item, localIdx) => (
                                            <div key={localIdx} className="group flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-b-0">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleItem(group.name, localIdx)}
                                                    className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.checked
                                                            ? `${color.checkBg} border-transparent text-white`
                                                            : "border-gray-300 bg-white hover:border-gray-500"
                                                        }`}
                                                >
                                                    {item.checked && (
                                                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.text}
                                                    onChange={(e) => updateItemText(group.name, localIdx, e.target.value)}
                                                    className={`flex-1 bg-transparent border-none outline-none text-sm p-0 focus:ring-0 ${item.checked ? "line-through text-gray-400" : "text-gray-800 font-medium"
                                                        }`}
                                                    placeholder="Item..."
                                                />
                                                <button
                                                    onClick={() => removeItem(group.name, localIdx)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 w-5 h-5 flex items-center justify-center transition-all text-xs"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => addItem(group.name)}
                                            className={`flex items-center gap-1.5 text-xs font-bold ${color.title} opacity-70 hover:opacity-100 py-2.5 transition-opacity`}
                                        >
                                            <span className="text-base leading-none">+</span> Add item
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Add Category Input */}
            {showCategoryInput && (
                <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex gap-3 items-center">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setShowCategoryInput(false); }}
                        className="flex-1 text-sm font-semibold text-gray-800 bg-transparent border-none outline-none p-0 focus:ring-0"
                        placeholder="Category name..."
                        autoFocus
                    />
                    <button onClick={addCategory} className="text-xs font-bold text-blue-500">Add</button>
                    <button onClick={() => setShowCategoryInput(false)} className="text-xs text-gray-400">✕</button>
                </div>
            )}

            {/* Floating Add Category Button */}
            <div className="flex justify-end mt-5">
                <button
                    onClick={() => setShowCategoryInput(true)}
                    className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white
                     shadow-lg shadow-blue-200 flex items-center justify-center transition-all active:scale-90"
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
