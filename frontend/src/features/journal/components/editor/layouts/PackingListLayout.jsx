import { useMemo, useState } from "react";

/**
 * Packing List Layout — dark theme consistent
 *
 * Features:
 * - Progress bar with item count
 * - Categorized items with colored accents
 * - 2-column layout for smaller categories
 * - Add item / add category support
 */

const CATEGORY_COLORS = [
    { bg: "bg-zinc-800/50", border: "border-rose-500/30", title: "text-rose-400", dot: "bg-rose-400", headerBg: "bg-rose-500/10" },
    { bg: "bg-zinc-800/50", border: "border-blue-500/30", title: "text-blue-400", dot: "bg-blue-400", headerBg: "bg-blue-500/10" },
    { bg: "bg-zinc-800/50", border: "border-emerald-500/30", title: "text-emerald-400", dot: "bg-emerald-400", headerBg: "bg-emerald-500/10" },
    { bg: "bg-zinc-800/50", border: "border-amber-500/30", title: "text-amber-400", dot: "bg-amber-400", headerBg: "bg-amber-500/10" },
    { bg: "bg-zinc-800/50", border: "border-purple-500/30", title: "text-purple-400", dot: "bg-purple-400", headerBg: "bg-purple-500/10" },
    { bg: "bg-zinc-800/50", border: "border-teal-500/30", title: "text-teal-400", dot: "bg-teal-400", headerBg: "bg-teal-500/10" },
];

function normalizeItems(items) {
    return items.map((item) => {
        if (typeof item === "string") {
            return { text: item, checked: false, category: "" };
        }
        return {
            text: item.text || "",
            checked: !!item.checked,
            category: item.category || "",
        };
    });
}

function groupByCategory(items) {
    const groups = [];
    let currentGroup = { name: "Items", items: [] };

    for (const item of items) {
        if (item.category) {
            if (currentGroup.name !== item.category) {
                if (currentGroup.items.length > 0) groups.push(currentGroup);
                currentGroup = { name: item.category, items: [] };
            }
            currentGroup.items.push(item);
        } else {
            currentGroup.items.push(item);
        }
    }
    if (currentGroup.items.length > 0) groups.push(currentGroup);

    return groups;
}

export default function PackingListLayout({ template, blocks, setBlocks }) {
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    const rawItems = checklistBlock?.data?.items || [];
    const items = useMemo(() => normalizeItems(rawItems), [rawItems]);

    const groups = useMemo(() => groupByCategory(items), [items]);

    const totalItems = items.length;
    const checkedItems = items.filter((i) => i.checked).length;
    const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    const updateItems = (newItems) => {
        if (!checklistBlock) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === checklistBlock.id ? { ...b, data: { items: newItems } } : b
            )
        );
    };

    const toggleItem = (idx) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
        updateItems(updated);
    };

    const updateItemText = (idx, text) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], text };
        updateItems(updated);
    };

    const addItem = (category = "") => {
        updateItems([...items, { text: "", checked: false, category }]);
    };

    const addCategory = () => {
        const name = prompt("Category name:");
        if (!name) return;
        updateItems([...items, { text: "", checked: false, category: name }]);
    };

    const removeItem = (idx) => {
        updateItems(items.filter((_, i) => i !== idx));
    };

    // Build rows: groups with <=3 items can pair up in 2-col
    const layoutRows = useMemo(() => {
        const rows = [];
        let i = 0;
        while (i < groups.length) {
            const g = groups[i];
            if (g.items.length <= 3 && i + 1 < groups.length && groups[i + 1].items.length <= 3) {
                rows.push([groups[i], groups[i + 1]]);
                i += 2;
            } else {
                rows.push([g]);
                i++;
            }
        }
        return rows;
    }, [groups]);

    const getGlobalIdx = (group, localIdx) => {
        let count = 0;
        for (const g of groups) {
            if (g === group) return count + localIdx;
            count += g.items.length;
        }
        return localIdx;
    };

    return (
        <div className="py-3">
            {/* Header */}
            <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                    {template?.name || "Packing List"} 🗺️
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Prepare items for trips"}
                </p>
            </div>

            {/* Progress Card */}
            <div className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50 mb-5">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-zinc-100">
                        {checkedItems} / {totalItems}
                    </span>
                    <span className="text-sm text-zinc-400">Items</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span className="text-xs font-medium text-zinc-400 min-w-[32px] text-right">
                        {percent}%
                    </span>
                </div>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
                {layoutRows.map((row, ri) => (
                    <div
                        key={ri}
                        className={row.length === 2 ? "grid grid-cols-2 gap-3" : ""}
                    >
                        {row.map((group, gi) => {
                            const colorIdx = groups.indexOf(group);
                            const color = CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length];

                            return (
                                <div
                                    key={colorIdx}
                                    className={`rounded-2xl border ${color.border} overflow-hidden`}
                                >
                                    {/* Category header */}
                                    <div className={`${color.headerBg} px-4 py-2.5 flex items-center justify-between`}>
                                        <h4 className={`text-sm font-semibold ${color.title}`}>
                                            {group.name}
                                        </h4>
                                        <button className="text-zinc-500 hover:text-zinc-300 text-sm">⋯</button>
                                    </div>

                                    {/* Items */}
                                    <div className={`${color.bg} px-4 py-2`}>
                                        {group.items.map((item, ii) => {
                                            const idx = getGlobalIdx(group, ii);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="group flex items-center gap-3 py-2"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleItem(idx)}
                                                        className={`
                              flex-shrink-0 w-5 h-5 rounded-md border-2
                              flex items-center justify-center transition-all
                              ${item.checked
                                                                ? "bg-emerald-500 border-emerald-500 text-white"
                                                                : "border-zinc-500 bg-zinc-700/50 hover:border-emerald-400"
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
                                                        onChange={(e) => updateItemText(idx, e.target.value)}
                                                        className={`
                              flex-1 bg-transparent border-none outline-none text-sm
                              ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}
                            `}
                                                        placeholder="Item…"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(idx)}
                                                        className="opacity-0 group-hover:opacity-100 text-zinc-500
                                       hover:text-red-400 text-xs transition-all"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            onClick={() => addItem(group.name)}
                                            className="flex items-center gap-1 text-xs text-zinc-500
                                 hover:text-blue-400 font-medium py-2 transition-colors"
                                        >
                                            <span className="text-sm">+</span> Add item
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Add Category button */}
            <button
                type="button"
                onClick={addCategory}
                className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-zinc-700
                   text-sm font-medium text-zinc-500 hover:border-blue-500/50
                   hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
            >
                <span className="text-lg leading-none">+</span> Add Category
            </button>

            {/* Floating add button */}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={addCategory}
                    className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white
                     shadow-lg shadow-blue-500/30 flex items-center justify-center
                     transition-all active:scale-90"
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
