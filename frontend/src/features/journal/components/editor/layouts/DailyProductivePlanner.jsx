import { useState, useEffect } from "react";
import dayjs from "dayjs";

/**
 * Daily Productive Planner
 * - Header: Date + completion %
 * - Top 3 Priorities (checkable)
 * - Schedule with time slots (editable, checkable)
 * - Morning / Evening dividers
 * - Notes section
 * - Reflection section
 *
 * DATA MODEL:
 *   blocks[0] = checklist (priorities)
 *   blocks[1] = checklist (schedule)  ← separate block, created if missing
 *   blocks[2] = text (notes)
 *   blocks[3] = text (reflection)
 */

const DEFAULT_SCHEDULE = [
    { time: "8:00 AM", text: "", checked: false, label: "" },
    { time: "9:00 AM", text: "", checked: false, label: "" },
    { time: "10:00 AM", text: "", checked: false, label: "" },
    { time: "11:00 AM", text: "", checked: false, label: "" },
    { time: "12:00 PM", text: "", checked: false, label: "Morning" },
    { time: "1:00 PM", text: "", checked: false, label: "" },
    { time: "2:00 PM", text: "", checked: false, label: "" },
    { time: "3:00 PM", text: "", checked: false, label: "Evening" },
    { time: "4:00 PM", text: "", checked: false, label: "" },
    { time: "5:00 PM", text: "", checked: false, label: "" },
];

const STATUS_LABELS = ["In Progress", "Done", "Cancelled", "On Hold"];

const STATUS_COLOR = {
    "In Progress": "bg-blue-50 text-blue-600",
    Done: "bg-emerald-50 text-emerald-600",
    Cancelled: "bg-gray-100 text-gray-400",
    "On Hold": "bg-amber-50 text-amber-600",
};

export default function DailyProductivePlanner({ template, blocks, setBlocks }) {
    const checklistBlocks = blocks.filter((b) => b.type === "checklist");
    const textBlocks = blocks.filter((b) => b.type === "text");

    const prioritiesBlock = checklistBlocks[0] || null;
    const notesBlock = textBlocks[0] || null;
    const reflectionBlock = textBlocks[1] || null;

    const priorities = (prioritiesBlock?.data?.items || []).map((item) =>
        typeof item === "string"
            ? { text: item, checked: false }
            : { text: item?.text || "", checked: !!item?.checked, status: item?.status || "" }
    );

    // ─── SCHEDULE STATE ───
    // Find or create a dedicated schedule block (second checklist block)
    const getScheduleBlock = () => checklistBlocks[1] || null;

    const parseScheduleFromBlock = (block) => {
        if (!block?.data?.items?.length) return null;
        return block.data.items.map((item) =>
            typeof item === "string"
                ? { time: "8:00 AM", text: item, checked: false, label: "" }
                : {
                    time: item.time || "8:00 AM",
                    text: item.text || "",
                    checked: !!item.checked,
                    label: item.label || "",
                    status: item.status || "",
                }
        );
    };

    const scheduleBlock = getScheduleBlock();
    const savedSchedule = parseScheduleFromBlock(scheduleBlock);
    const schedule = savedSchedule || DEFAULT_SCHEDULE;

    const [showStatusMenu, setShowStatusMenu] = useState(null);
    const today = dayjs().format("dddd, MMMM D");

    // Computed completion
    const totalPriorities = priorities.filter((p) => p.text.trim()).length;
    const donePriorities = priorities.filter((p) => p.checked && p.text.trim()).length;
    const percent = totalPriorities > 0 ? Math.round((donePriorities / totalPriorities) * 100) : 0;

    const updateBlockById = (blockId, data) => {
        setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, data } : b)));
    };

    // ─── PRIORITIES ───
    const togglePriority = (i) => {
        if (!prioritiesBlock) return;
        const updated = [...priorities];
        updated[i] = { ...updated[i], checked: !updated[i].checked };
        updateBlockById(prioritiesBlock.id, { items: updated });
    };

    const updatePriorityText = (i, text) => {
        if (!prioritiesBlock) return;
        const updated = [...priorities];
        updated[i] = { ...updated[i], text };
        updateBlockById(prioritiesBlock.id, { items: updated });
    };

    const addPriority = () => {
        if (!prioritiesBlock) return;
        const updated = [...priorities, { text: "", checked: false }];
        updateBlockById(prioritiesBlock.id, { items: updated });
    };

    // ─── SCHEDULE (always syncs to blocks) ───
    const updateScheduleInBlocks = (newSchedule) => {
        const sBlock = getScheduleBlock();
        if (sBlock) {
            // Update existing schedule block
            updateBlockById(sBlock.id, { items: newSchedule });
        } else {
            // Create a new schedule block
            setBlocks((prev) => [
                ...prev,
                {
                    id: "schedule-" + Date.now(),
                    type: "checklist",
                    data: { items: newSchedule },
                },
            ]);
        }
    };

    const toggleSlot = (i) => {
        const updated = [...schedule];
        updated[i] = { ...updated[i], checked: !updated[i].checked };
        updateScheduleInBlocks(updated);
    };

    const updateSlotText = (i, text) => {
        const updated = [...schedule];
        updated[i] = { ...updated[i], text };
        updateScheduleInBlocks(updated);
    };

    const updateSlotTime = (i, time) => {
        const updated = [...schedule];
        updated[i] = { ...updated[i], time };
        updateScheduleInBlocks(updated);
    };

    const removeSlot = (i) => {
        updateScheduleInBlocks(schedule.filter((_, idx) => idx !== i));
    };

    const updateSlotStatus = (i, status) => {
        const updated = [...schedule];
        updated[i] = { ...updated[i], status };
        updateScheduleInBlocks(updated);
        setShowStatusMenu(null);
    };

    const addScheduleSlot = () => {
        const lastTime = schedule.length > 0 ? schedule[schedule.length - 1].time : "5:00 PM";
        updateScheduleInBlocks([...schedule, { time: lastTime, text: "", checked: false, label: "" }]);
    };

    return (
        <div className="py-3">
            {/* Header */}
            <div className="mb-5 px-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-gray-900">{today}</h2>
                    <button
                        onClick={addPriority}
                        className="text-blue-500 text-xl font-medium"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Top 3 Priorities */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-extrabold text-gray-900">Top 3 Priorities</h3>
                    <span
                        className={`text-xs font-bold ${percent >= 70 ? "text-emerald-600" : "text-gray-500"
                            }`}
                    >
                        {percent}%
                    </span>
                </div>
                {totalPriorities > 0 && (
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percent >= 70 ? "bg-emerald-500" : "bg-blue-500"
                                }`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                )}
                <div className="space-y-3 mt-3">
                    {(priorities.length
                        ? priorities
                        : [
                            { text: "", checked: false },
                            { text: "", checked: false },
                            { text: "", checked: false },
                        ]
                    ).map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => togglePriority(i)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${p.checked
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "border-gray-300 bg-white hover:border-blue-400"
                                    }`}
                            >
                                {p.checked && (
                                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                        <path
                                            d="M2.5 6L5 8.5L9.5 3.5"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="text"
                                value={p.text}
                                onChange={(e) => updatePriorityText(i, e.target.value)}
                                className={`flex-1 text-sm bg-transparent border-none outline-none p-0 focus:ring-0 ${p.checked
                                        ? "line-through text-gray-400"
                                        : "text-gray-800 font-medium"
                                    }`}
                                placeholder={`Priority ${i + 1}…`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-extrabold text-gray-900">Schedule</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {schedule.filter((s) => s.checked).length}/{schedule.length} done
                    </span>
                </div>

                <div className="space-y-1">
                    {schedule.map((slot, i) => (
                        <div key={i}>
                            {/* Section label divider */}
                            {slot.label && (
                                <div
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg mb-1 mt-2 ${slot.label === "Morning"
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-orange-50 text-orange-700"
                                        }`}
                                >
                                    {slot.label}
                                </div>
                            )}

                            <div
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors ${slot.checked
                                        ? "bg-emerald-50/50"
                                        : i === 0
                                            ? "bg-blue-50 border border-blue-100"
                                            : "hover:bg-gray-50"
                                    }`}
                            >
                                {/* Checkbox */}
                                <button
                                    type="button"
                                    onClick={() => toggleSlot(i)}
                                    className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${slot.checked
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "border-gray-300 bg-white hover:border-blue-400"
                                        }`}
                                >
                                    {slot.checked && (
                                        <svg
                                            className="w-2.5 h-2.5"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                        >
                                            <path
                                                d="M2.5 6L5 8.5L9.5 3.5"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </button>

                                {/* Time — editable */}
                                <input
                                    type="text"
                                    value={slot.time}
                                    onChange={(e) => updateSlotTime(i, e.target.value)}
                                    className="text-[11px] font-bold text-gray-400 w-16 flex-shrink-0 bg-transparent border-none outline-none p-0 focus:ring-0 focus:text-gray-700"
                                    placeholder="8:00 AM"
                                />

                                {/* Task text */}
                                <input
                                    type="text"
                                    value={slot.text}
                                    onChange={(e) => updateSlotText(i, e.target.value)}
                                    className={`flex-1 text-sm bg-transparent border-none outline-none p-0 focus:ring-0 ${slot.checked
                                            ? "line-through text-gray-400"
                                            : "text-gray-800 font-medium"
                                        }`}
                                    placeholder="Add activity..."
                                />

                                {/* Status badge */}
                                <div className="relative">
                                    {slot.status ? (
                                        <button
                                            onClick={() =>
                                                setShowStatusMenu(
                                                    showStatusMenu === i ? null : i
                                                )
                                            }
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[slot.status] ||
                                                "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {slot.status}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setShowStatusMenu(
                                                    showStatusMenu === i ? null : i
                                                )
                                            }
                                            className="opacity-0 group-hover:opacity-100 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 transition-opacity"
                                        >
                                            + Status
                                        </button>
                                    )}
                                    {showStatusMenu === i && (
                                        <div className="absolute right-0 top-6 z-20 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 w-36 flex flex-col gap-1">
                                            {STATUS_LABELS.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateSlotStatus(i, s)}
                                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl text-left ${STATUS_COLOR[s]} hover:opacity-80`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Delete slot */}
                                <button
                                    type="button"
                                    onClick={() => removeSlot(i)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 text-xs transition-opacity flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addScheduleSlot}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 px-3 py-2 transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Add time slot
                    </button>
                </div>
            </div>

            {/* Notes + Reflection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-extrabold text-gray-900 mb-2">Notes</h3>
                    <textarea
                        value={notesBlock?.data?.text || ""}
                        onChange={(e) =>
                            notesBlock &&
                            updateBlockById(notesBlock.id, { text: e.target.value })
                        }
                        className="w-full text-xs text-gray-600 font-medium bg-transparent border-none outline-none resize-none min-h-[60px] focus:ring-0 p-0 placeholder-gray-300"
                        placeholder="Add some notes..."
                    />
                </div>

                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-extrabold text-gray-900 mb-2">Reflection</h3>
                    <p className="text-[10px] text-gray-400 font-medium mb-1">
                        What went well today?
                    </p>
                    <textarea
                        value={reflectionBlock?.data?.text || ""}
                        onChange={(e) =>
                            reflectionBlock &&
                            updateBlockById(reflectionBlock.id, { text: e.target.value })
                        }
                        className="w-full text-xs text-gray-600 font-medium bg-transparent border-none outline-none resize-none min-h-[50px] focus:ring-0 p-0 placeholder-gray-300"
                        placeholder="Write about your wins..."
                    />
                </div>
            </div>
        </div>
    );
}
