import { useState } from "react";
import dayjs from "dayjs";

/**
 * Time Blocking Planner — Matching image 5
 * - Timeline from 6 AM down
 * - Colored time blocks with title, time range, category tag
 * - Total Focus Time summary at bottom
 * - Floating + Add Block button
 */

const BLOCK_COLORS = [
    { bg: "bg-blue-50", border: "border-l-blue-400", dot: "bg-blue-400", tag: "bg-blue-100 text-blue-700" },
    { bg: "bg-amber-50", border: "border-l-amber-400", dot: "bg-amber-400", tag: "bg-amber-100 text-amber-700" },
    { bg: "bg-emerald-50", border: "border-l-emerald-400", dot: "bg-emerald-400", tag: "bg-emerald-100 text-emerald-700" },
    { bg: "bg-indigo-50", border: "border-l-indigo-400", dot: "bg-indigo-400", tag: "bg-indigo-100 text-indigo-700" },
    { bg: "bg-rose-50", border: "border-l-rose-400", dot: "bg-rose-400", tag: "bg-rose-100 text-rose-700" },
    { bg: "bg-purple-50", border: "border-l-purple-400", dot: "bg-purple-400", tag: "bg-purple-100 text-purple-700" },
];

const HOURS = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];

const DEFAULT_BLOCKS = [
    { id: 1, startHour: 6, endHour: 7, title: "Meeting", tag: "Work", colorIdx: 0, timeLabel: "7 AM" },
    { id: 2, startHour: 7, endHour: 9, title: "Deep Work", tag: "Focus", colorIdx: 1, timeLabel: "9-11 AM" },
    { id: 3, startHour: 10, endHour: 11, title: "Lunch Break", tag: "Personal", colorIdx: 2, timeLabel: "12:00 PM" },
    { id: 4, startHour: 12, endHour: 14, title: "Project Work", tag: "Work", colorIdx: 3, timeLabel: "3-40 PM" },
    { id: 5, startHour: 14, endHour: 15, title: "Gym", tag: "Health", colorIdx: 4, timeLabel: "5:00 PM" },
];

export default function TimeBlockingPlanner({ template, blocks, setBlocks }) {
    const [timeBlocks, setTimeBlocks] = useState(DEFAULT_BLOCKS);
    const [editingId, setEditingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBlock, setNewBlock] = useState({ title: "", tag: "", startHour: 8, endHour: 9, colorIdx: 0 });

    const today = dayjs().format("dddd, MMMM D");

    // Total focus time (duration of all blocks in hours)
    const totalHours = timeBlocks.reduce((sum, b) => sum + (b.endHour - b.startHour), 0);
    const totalMins = totalHours * 60;
    const focusDisplay = `${Math.floor(totalMins / 60)}h ${totalMins % 60 > 0 ? totalMins % 60 + "m" : "00m"}`;

    const saveToBlocks = (newTimeBlocks) => {
        // Persist as checklist items
        const checklistBlock = blocks.find(b => b.type === "checklist");
        if (checklistBlock) {
            setBlocks(prev => prev.map(b => b.id === checklistBlock.id
                ? { ...b, data: { items: newTimeBlocks.map(tb => ({ text: tb.title, checked: false, tag: tb.tag, startHour: tb.startHour, endHour: tb.endHour, colorIdx: tb.colorIdx })) } }
                : b
            ));
        }
    };

    const addBlock = () => {
        const added = { ...newBlock, id: Date.now(), timeLabel: `${HOURS[newBlock.endHour]}` };
        const updated = [...timeBlocks, added].sort((a, b) => a.startHour - b.startHour);
        setTimeBlocks(updated);
        saveToBlocks(updated);
        setShowAddModal(false);
        setNewBlock({ title: "", tag: "", startHour: 8, endHour: 9, colorIdx: 0 });
    };

    const removeBlock = (id) => {
        const updated = timeBlocks.filter(b => b.id !== id);
        setTimeBlocks(updated);
        saveToBlocks(updated);
    };

    const updateBlock = (id, field, value) => {
        const updated = timeBlocks.map(b => b.id === id ? { ...b, [field]: value } : b);
        setTimeBlocks(updated);
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
                    {/* Hour markers */}
                    {HOURS.map((hour, hi) => {
                        const blocksAtHour = timeBlocks.filter(b => b.startHour === hi);
                        return (
                            <div key={hi} className="relative min-h-[56px] group">
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
                                        const isEditing = editingId === block.id;
                                        const heightClass = block.endHour - block.startHour >= 2 ? "py-4" : "py-2.5";

                                        return (
                                            <div
                                                key={block.id}
                                                onClick={() => setEditingId(isEditing ? null : block.id)}
                                                className={`${colors.bg} border-l-4 ${colors.border} rounded-r-2xl px-4 ${heightClass} cursor-pointer relative group/block`}
                                            >
                                                {/* Remove btn */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                                    className="absolute top-1.5 right-2 opacity-0 group-hover/block:opacity-100 text-gray-400 hover:text-red-500 w-5 h-5 flex items-center justify-center transition-all text-xs rounded"
                                                >
                                                    ✕
                                                </button>

                                                {isEditing ? (
                                                    <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="text"
                                                            value={block.title}
                                                            onChange={(e) => updateBlock(block.id, "title", e.target.value)}
                                                            className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                                                            autoFocus
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={block.tag}
                                                                onChange={(e) => updateBlock(block.id, "tag", e.target.value)}
                                                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colors.tag} bg-opacity-80 border-none outline-none focus:ring-0 w-20`}
                                                                placeholder="Category"
                                                            />
                                                            <div className="flex gap-1 ml-auto">
                                                                {BLOCK_COLORS.map((c, ci) => (
                                                                    <button
                                                                        key={ci}
                                                                        onClick={() => updateBlock(block.id, "colorIdx", ci)}
                                                                        className={`w-4 h-4 rounded-full ${c.dot} ring-2 ring-white ${block.colorIdx === ci ? "ring-blue-500" : "ring-transparent"} transition-all`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                                                <p className="text-sm font-bold text-gray-800">{block.title || "Untitled"}</p>
                                                            </div>
                                                            {block.tag && (
                                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${colors.tag}`}>
                                                                    {block.tag}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {block.timeLabel && (
                                                            <span className="text-[11px] font-bold text-gray-400 mt-0.5">{block.timeLabel}</span>
                                                        )}
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
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                </div>
                <div>
                    <p className="text-lg font-extrabold text-gray-900">{focusDisplay}</p>
                    <p className="text-xs font-semibold text-gray-400">Total Focus Time</p>
                </div>
            </div>

            {/* Add Block Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-base font-extrabold text-gray-900 mb-4">Add Time Block</h3>
                        <input
                            type="text"
                            value={newBlock.title}
                            onChange={(e) => setNewBlock(p => ({ ...p, title: e.target.value }))}
                            className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none mb-3 focus:border-blue-400"
                            placeholder="Block title..."
                            autoFocus
                        />
                        <input
                            type="text"
                            value={newBlock.tag}
                            onChange={(e) => setNewBlock(p => ({ ...p, tag: e.target.value }))}
                            className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none mb-3 focus:border-blue-400"
                            placeholder="Category (e.g. Work, Focus, Health)"
                        />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Start</label>
                                <select value={newBlock.startHour} onChange={(e) => setNewBlock(p => ({ ...p, startHour: Number(e.target.value) }))}
                                    className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none">
                                    {HOURS.map((h, i) => <option key={i} value={i}>{h}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">End</label>
                                <select value={newBlock.endHour} onChange={(e) => setNewBlock(p => ({ ...p, endHour: Number(e.target.value) }))}
                                    className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none">
                                    {HOURS.map((h, i) => <option key={i} value={i + 1}>{h}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-5">
                            {BLOCK_COLORS.map((c, ci) => (
                                <button key={ci} onClick={() => setNewBlock(p => ({ ...p, colorIdx: ci }))}
                                    className={`w-7 h-7 rounded-full ${c.dot} ring-2 ring-white ${newBlock.colorIdx === ci ? "ring-blue-500 scale-110" : "ring-transparent"} transition-all`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm">Cancel</button>
                            <button onClick={addBlock} className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm">Add Block</button>
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
