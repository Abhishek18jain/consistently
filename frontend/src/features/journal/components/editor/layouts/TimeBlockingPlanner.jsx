import { useState } from "react";
import dayjs from "dayjs";

/**
 * Time Blocking Planner
 * - Timeline from 6 AM → 10 PM
 * - Colored time blocks with title, time range, category tag
 * - Total Focus Time summary
 * - Floating + Add Block button
 *
 * DATA MODEL:
 *   blocks[0] = checklist block where each item stores a time block:
 *     { text: "title", checked: false, tag, startHour, endHour, colorIdx }
 */

const BLOCK_COLORS = [
    { bg: "bg-blue-50", border: "border-l-blue-400", dot: "bg-blue-400", tag: "bg-blue-100 text-blue-700" },
    { bg: "bg-amber-50", border: "border-l-amber-400", dot: "bg-amber-400", tag: "bg-amber-100 text-amber-700" },
    { bg: "bg-emerald-50", border: "border-l-emerald-400", dot: "bg-emerald-400", tag: "bg-emerald-100 text-emerald-700" },
    { bg: "bg-indigo-50", border: "border-l-indigo-400", dot: "bg-indigo-400", tag: "bg-indigo-100 text-indigo-700" },
    { bg: "bg-rose-50", border: "border-l-rose-400", dot: "bg-rose-400", tag: "bg-rose-100 text-rose-700" },
    { bg: "bg-purple-50", border: "border-l-purple-400", dot: "bg-purple-400", tag: "bg-purple-100 text-purple-700" },
];

const HOURS = [
    "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM", "9 PM", "10 PM",
];

const DEFAULT_TIME_BLOCKS = [
    { text: "Morning Routine", checked: false, tag: "Personal", startHour: 2, endHour: 3, colorIdx: 2 },
    { text: "Deep Work", checked: false, tag: "Focus", startHour: 3, endHour: 5, colorIdx: 1 },
    { text: "Lunch Break", checked: false, tag: "Personal", startHour: 6, endHour: 7, colorIdx: 2 },
    { text: "Meetings", checked: false, tag: "Work", startHour: 7, endHour: 9, colorIdx: 0 },
    { text: "Exercise", checked: false, tag: "Health", startHour: 11, endHour: 12, colorIdx: 4 },
];

function parseTimeBlocksFromBlocks(blocks) {
    const checklistBlock = blocks.find((b) => b.type === "checklist");
    if (!checklistBlock?.data?.items?.length) return null;

    return checklistBlock.data.items
        .map((item, idx) => {
            if (typeof item === "string") {
                return { id: idx, text: item, checked: false, tag: "", startHour: 2, endHour: 3, colorIdx: 0 };
            }
            return {
                id: idx,
                text: item.text || "",
                checked: !!item.checked,
                tag: item.tag || "",
                startHour: item.startHour ?? 2,
                endHour: item.endHour ?? 3,
                colorIdx: item.colorIdx ?? 0,
            };
        })
        .sort((a, b) => a.startHour - b.startHour);
}

export default function TimeBlockingPlanner({ template, blocks, setBlocks }) {
    const [editingIdx, setEditingIdx] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBlock, setNewBlock] = useState({ title: "", tag: "", startHour: 2, endHour: 3, colorIdx: 0 });

    const today = dayjs().format("dddd, MMMM D");

    // ─── Read time blocks from blocks (single source of truth) ───
    const parsed = parseTimeBlocksFromBlocks(blocks);
    const timeBlocks = parsed || DEFAULT_TIME_BLOCKS;

    // If no saved data exists yet, seed the blocks on first render
    if (!parsed && blocks.length > 0) {
        const checklistBlock = blocks.find((b) => b.type === "checklist");
        if (checklistBlock && (!checklistBlock.data?.items || checklistBlock.data.items.length === 0)) {
            // Will be saved on next interaction
        }
    }

    // Total focus time
    const totalHours = timeBlocks.reduce((sum, b) => sum + (b.endHour - b.startHour), 0);
    const focusDisplay = `${totalHours}h 00m`;

    // ─── Persist to blocks ───
    const saveTimeBlocks = (newTimeBlocks) => {
        const items = newTimeBlocks.map((tb) => ({
            text: tb.text,
            checked: !!tb.checked,
            tag: tb.tag || "",
            startHour: tb.startHour,
            endHour: tb.endHour,
            colorIdx: tb.colorIdx,
        }));

        const checklistBlock = blocks.find((b) => b.type === "checklist");
        if (checklistBlock) {
            setBlocks((prev) =>
                prev.map((b) =>
                    b.id === checklistBlock.id ? { ...b, data: { items } } : b
                )
            );
        } else {
            // Create checklist block
            setBlocks((prev) => [
                ...prev,
                { id: "timeblocks-" + Date.now(), type: "checklist", data: { items } },
            ]);
        }
    };

    const addBlock = () => {
        if (!newBlock.title.trim()) return;
        const added = {
            text: newBlock.title.trim(),
            checked: false,
            tag: newBlock.tag || "",
            startHour: newBlock.startHour,
            endHour: newBlock.endHour,
            colorIdx: newBlock.colorIdx,
        };
        const updated = [...timeBlocks, added].sort((a, b) => a.startHour - b.startHour);
        saveTimeBlocks(updated);
        setShowAddModal(false);
        setNewBlock({ title: "", tag: "", startHour: 2, endHour: 3, colorIdx: 0 });
    };

    const removeBlock = (idx) => {
        const updated = timeBlocks.filter((_, i) => i !== idx);
        saveTimeBlocks(updated);
    };

    const toggleBlock = (idx) => {
        const updated = [...timeBlocks];
        updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
        saveTimeBlocks(updated);
    };

    const updateBlockField = (idx, field, value) => {
        const updated = [...timeBlocks];
        updated[idx] = { ...updated[idx], [field]: value };
        saveTimeBlocks(updated);
    };

    return (
        <div className="py-3 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900">Time Blocking</h2>
                    <p className="text-xs font-semibold text-gray-400">{today}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                    <span className="text-sm">+</span> Add Block
                </button>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="relative pl-16 pr-4 py-4">
                    {HOURS.map((hour, hi) => {
                        const blocksAtHour = timeBlocks
                            .map((b, idx) => ({ ...b, idx }))
                            .filter((b) => b.startHour === hi);

                        return (
                            <div
                                key={hi}
                                className="relative min-h-[56px] group cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => {
                                    setNewBlock({ ...newBlock, startHour: hi, endHour: Math.min(hi + 1, HOURS.length - 1), title: "", tag: "", colorIdx: 0 });
                                    setShowAddModal(true);
                                }}
                            >
                                {/* Hour label */}
                                <div className="absolute left-[-3.5rem] top-0 text-[10px] font-bold text-gray-400 w-14 text-right">
                                    {hour}
                                </div>

                                {/* Dashed line */}
                                <div className="absolute left-[-1.5rem] right-0 top-3 h-px border-t border-dashed border-gray-100 pointer-events-none" />

                                {/* Blocks starting at this hour */}
                                <div className="flex flex-col gap-1.5">
                                    {blocksAtHour.map((block) => {
                                        const colors = BLOCK_COLORS[block.colorIdx % BLOCK_COLORS.length];
                                        const isEditing = editingIdx === block.idx;
                                        const heightClass =
                                            block.endHour - block.startHour >= 2
                                                ? "py-4"
                                                : "py-2.5";
                                        const endLabel = HOURS[block.endHour] || "";

                                        return (
                                            <div
                                                key={block.idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingIdx(isEditing ? null : block.idx);
                                                }}
                                                className={`${colors.bg} border-l-4 ${colors.border} rounded-r-2xl px-4 ${heightClass} cursor-pointer relative group/block transition-all ${block.checked ? "opacity-60" : ""}`}
                                            >
                                                {/* Remove btn */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeBlock(block.idx);
                                                    }}
                                                    className="absolute top-1.5 right-2 opacity-0 group-hover/block:opacity-100 text-gray-400 hover:text-red-500 w-5 h-5 flex items-center justify-center transition-all text-xs rounded"
                                                >
                                                    ✕
                                                </button>

                                                {/* Done checkbox */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBlock(block.idx);
                                                    }}
                                                    className="absolute top-1.5 right-8 opacity-0 group-hover/block:opacity-100 text-gray-400 hover:text-emerald-500 w-5 h-5 flex items-center justify-center transition-all text-xs rounded"
                                                >
                                                    {block.checked ? "↩" : "✓"}
                                                </button>

                                                {isEditing ? (
                                                    <div
                                                        className="space-y-1.5"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            type="text"
                                                            value={block.text}
                                                            onChange={(e) =>
                                                                updateBlockField(
                                                                    block.idx,
                                                                    "text",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                                                            autoFocus
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={block.tag}
                                                                onChange={(e) =>
                                                                    updateBlockField(
                                                                        block.idx,
                                                                        "tag",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colors.tag} bg-opacity-80 border-none outline-none focus:ring-0 w-20`}
                                                                placeholder="Category"
                                                            />
                                                            <div className="flex gap-1 ml-auto">
                                                                {BLOCK_COLORS.map((c, ci) => (
                                                                    <button
                                                                        key={ci}
                                                                        onClick={() =>
                                                                            updateBlockField(
                                                                                block.idx,
                                                                                "colorIdx",
                                                                                ci
                                                                            )
                                                                        }
                                                                        className={`w-4 h-4 rounded-full ${c.dot} ring-2 ring-white ${block.colorIdx === ci
                                                                            ? "ring-blue-500"
                                                                            : "ring-transparent"
                                                                            } transition-all`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`w-2 h-2 rounded-full ${colors.dot}`}
                                                                />
                                                                <p
                                                                    className={`text-sm font-bold ${block.checked
                                                                        ? "line-through text-gray-400"
                                                                        : "text-gray-800"
                                                                        }`}
                                                                >
                                                                    {block.text || "Untitled"}
                                                                </p>
                                                            </div>
                                                            {block.tag && (
                                                                <span
                                                                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${colors.tag}`}
                                                                >
                                                                    {block.tag}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                                                            {HOURS[block.startHour]} – {endLabel}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Total Focus Time */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                </div>
                <div>
                    <p className="text-lg font-extrabold text-gray-900">{focusDisplay}</p>
                    <p className="text-xs font-semibold text-gray-400">Total Scheduled Time</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-lg font-extrabold text-emerald-600">
                        {timeBlocks.filter((b) => b.checked).length}/{timeBlocks.length}
                    </p>
                    <p className="text-xs font-semibold text-gray-400">Completed</p>
                </div>
            </div>

            {/* Add Block Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-base font-extrabold text-gray-900 mb-4">
                            Add Time Block
                        </h3>
                        <input
                            type="text"
                            value={newBlock.title}
                            onChange={(e) =>
                                setNewBlock((p) => ({ ...p, title: e.target.value }))
                            }
                            className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none mb-3 focus:border-blue-400"
                            placeholder="Block title..."
                            autoFocus
                        />
                        <input
                            type="text"
                            value={newBlock.tag}
                            onChange={(e) =>
                                setNewBlock((p) => ({ ...p, tag: e.target.value }))
                            }
                            className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none mb-3 focus:border-blue-400"
                            placeholder="Category (e.g. Work, Focus, Health)"
                        />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                    Start
                                </label>
                                <select
                                    value={newBlock.startHour}
                                    onChange={(e) =>
                                        setNewBlock((p) => ({
                                            ...p,
                                            startHour: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none"
                                >
                                    {HOURS.map((h, i) => (
                                        <option key={i} value={i}>
                                            {h}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                    End
                                </label>
                                <select
                                    value={newBlock.endHour}
                                    onChange={(e) =>
                                        setNewBlock((p) => ({
                                            ...p,
                                            endHour: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none"
                                >
                                    {HOURS.map((h, i) => (
                                        <option key={i} value={i + 1}>
                                            {h}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-5">
                            {BLOCK_COLORS.map((c, ci) => (
                                <button
                                    key={ci}
                                    onClick={() =>
                                        setNewBlock((p) => ({ ...p, colorIdx: ci }))
                                    }
                                    className={`w-7 h-7 rounded-full ${c.dot} ring-2 ring-white ${newBlock.colorIdx === ci
                                        ? "ring-blue-500 scale-110"
                                        : "ring-transparent"
                                        } transition-all`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addBlock}
                                className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm"
                            >
                                Add Block
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating + Button */}
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200 flex items-center justify-center text-2xl active:scale-90 transition-transform"
                >
                    +
                </button>
            </div>
        </div>
    );
}
