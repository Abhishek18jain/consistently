import dayjs from "dayjs";
import { useState } from "react";

/**
 * Daily Planner Layout — Light theme
 * Matching design from screenshot:
 * - Editable Top Priorities
 * - Scrollable 12+ hour schedule with editable events
 * - Editable Tasks with tags
 * - Notes section
 */

const PRIORITY_TAGS = [
    { label: "High", color: "bg-rose-50 text-rose-600" },
    { label: "Medium", color: "bg-amber-50 text-amber-600" },
    { label: "Low", color: "bg-blue-50 text-blue-600" },
    { label: "Ideas", color: "bg-purple-50 text-purple-600" },
];

const TASK_TAGS = [
    { label: "Ideas", color: "bg-purple-50 text-purple-600" },
    { label: "Low", color: "bg-blue-50 text-blue-600" },
    { label: "Work", color: "bg-indigo-50 text-indigo-600" },
    { label: "Personal", color: "bg-rose-50 text-rose-600" },
];

const EVENT_COLORS = [
    { bg: "bg-blue-50", border: "border-l-blue-400", label: "bg-blue-100 text-blue-700" },
    { bg: "bg-emerald-50", border: "border-l-emerald-400", label: "bg-emerald-100 text-emerald-700" },
    { bg: "bg-violet-50", border: "border-l-violet-400", label: "bg-violet-100 text-violet-700" },
    { bg: "bg-amber-50", border: "border-l-amber-400", label: "bg-amber-100 text-amber-700" },
    { bg: "bg-rose-50", border: "border-l-rose-400", label: "bg-rose-100 text-rose-700" },
];

function generateHours(startHour = 7, count = 14) {
    return Array.from({ length: count }, (_, i) => {
        const h = (startHour + i) % 24;
        if (h === 0) return "12 AM";
        if (h < 12) return `${h} AM`;
        if (h === 12) return "12 PM";
        return `${h - 12} PM`;
    });
}

export default function DailyPlannerLayout({ template, blocks, setBlocks }) {
    const checklistBlocks = blocks.filter((b) => b.type === "checklist");
    const textBlocks = blocks.filter((b) => b.type === "text");

    const prioritiesBlock = checklistBlocks[0] || null;
    const tasksBlock = checklistBlocks[1] || null;
    const notesBlock = textBlocks[0] || null;

    const priorities = (prioritiesBlock?.data?.items || []).map((item) =>
        typeof item === "string" ? { text: item, checked: false, tag: "" } : { text: item.text || "", checked: !!item.checked, tag: item.tag || "" }
    );

    const tasks = (tasksBlock?.data?.items || []).map((item) =>
        typeof item === "string" ? { text: item, checked: false, tag: "" } : { text: item.text || "", checked: !!item.checked, tag: item.tag || "" }
    );

    // Local schedule state - NOT stored in blocks (local for now, could be extended)
    const [startHour, setStartHour] = useState(9);
    const [scheduleEvents, setScheduleEvents] = useState([
        { hour: 9, title: "Deep Work", label: "Focus", colorIdx: 0 },
        { hour: 11, title: "Client Meeting", label: "Work", colorIdx: 1 },
    ]);
    const [editingEvent, setEditingEvent] = useState(null); // idx of the event being edited
    const [showTagMenu, setShowTagMenu] = useState(null); // { type, idx }

    const hours = generateHours(startHour, 14);

    const today = dayjs().format("dddd, MMMM D");

    const updateBlock = (blockId, newData) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === blockId ? { ...b, data: newData } : b))
        );
    };

    // Priorities
    const togglePriority = (idx) => {
        if (!prioritiesBlock) return;
        const newItems = [...priorities];
        newItems[idx] = { ...newItems[idx], checked: !newItems[idx].checked };
        updateBlock(prioritiesBlock.id, { items: newItems });
    };
    const updatePriorityText = (idx, text) => {
        if (!prioritiesBlock) return;
        const newItems = [...priorities];
        newItems[idx] = { ...newItems[idx], text };
        updateBlock(prioritiesBlock.id, { items: newItems });
    };
    const updatePriorityTag = (idx, tag) => {
        if (!prioritiesBlock) return;
        const newItems = [...priorities];
        newItems[idx] = { ...newItems[idx], tag };
        updateBlock(prioritiesBlock.id, { items: newItems });
        setShowTagMenu(null);
    };
    const addPriority = () => {
        if (!prioritiesBlock) return;
        updateBlock(prioritiesBlock.id, { items: [...priorities, { text: "", checked: false, tag: "" }] });
    };

    // Tasks
    const toggleTask = (idx) => {
        if (!tasksBlock) return;
        const newItems = [...tasks];
        newItems[idx] = { ...newItems[idx], checked: !newItems[idx].checked };
        updateBlock(tasksBlock.id, { items: newItems });
    };
    const updateTaskText = (idx, text) => {
        if (!tasksBlock) return;
        const newItems = [...tasks];
        newItems[idx] = { ...newItems[idx], text };
        updateBlock(tasksBlock.id, { items: newItems });
    };
    const updateTaskTag = (idx, tag) => {
        if (!tasksBlock) return;
        const newItems = [...tasks];
        newItems[idx] = { ...newItems[idx], tag };
        updateBlock(tasksBlock.id, { items: newItems });
        setShowTagMenu(null);
    };
    const addTask = () => {
        if (!tasksBlock) return;
        updateBlock(tasksBlock.id, { items: [...tasks, { text: "", checked: false, tag: "" }] });
    };

    // Schedule
    const updateEvent = (eventIdx, field, value) => {
        const newEvents = [...scheduleEvents];
        newEvents[eventIdx] = { ...newEvents[eventIdx], [field]: value };
        setScheduleEvents(newEvents);
    };
    const addEvent = (hourIndex) => {
        const newEvent = {
            hour: startHour + hourIndex,
            title: "New Event",
            label: "Focus",
            colorIdx: Math.floor(Math.random() * EVENT_COLORS.length),
        };
        setScheduleEvents([...scheduleEvents, newEvent].sort((a, b) => a.hour - b.hour));
        setEditingEvent(scheduleEvents.length);
    };

    return (
        <div className="py-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-extrabold text-gray-900">Daily Planner</h2>
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{today}</span>
            </div>

            {/* Top Priorities Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Top Priorities</h3>
                    <button className="text-gray-400 font-black">⋯</button>
                </div>
                <div className="space-y-2">
                    {(priorities.length ? priorities : [{ text: "", checked: false, tag: "" }]).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <button
                                type="button"
                                onClick={() => togglePriority(i)}
                                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all ${item.checked
                                        ? "bg-emerald-100 text-emerald-500"
                                        : "border-2 border-gray-200 hover:border-blue-400"
                                    }`}
                            >
                                {item.checked && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updatePriorityText(i, e.target.value)}
                                className={`flex-1 bg-transparent border-none outline-none text-sm p-0 focus:ring-0 ${item.checked ? "line-through text-gray-400" : "text-gray-800 font-medium"
                                    }`}
                                placeholder="Add priority..."
                            />
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowTagMenu(showTagMenu?.type === "p" && showTagMenu?.idx === i ? null : { type: "p", idx: i })}
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.tag
                                            ? PRIORITY_TAGS.find(t => t.label === item.tag)?.color || "bg-gray-100 text-gray-500"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }`}
                                >
                                    {item.tag || "Tag"}
                                </button>
                                {showTagMenu?.type === "p" && showTagMenu?.idx === i && (
                                    <div className="absolute right-0 top-7 z-20 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 flex flex-col gap-1 w-28">
                                        {PRIORITY_TAGS.map(tag => (
                                            <button
                                                key={tag.label}
                                                onClick={() => updatePriorityTag(i, tag.label)}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl text-left ${tag.color} hover:opacity-80`}
                                            >
                                                {tag.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addPriority} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600">
                    <span className="text-lg leading-none">+</span> Add Priority
                </button>
            </div>

            {/* Schedule Timeline Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Schedule</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Start:</span>
                        <select
                            value={startHour}
                            onChange={(e) => setStartHour(Number(e.target.value))}
                            className="text-xs font-bold text-gray-700 bg-gray-50 rounded-lg px-2 py-1 outline-none border border-gray-200"
                        >
                            {Array.from({ length: 24 }, (_, i) => {
                                const label = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
                                return <option key={i} value={i}>{label}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className="relative pl-12">
                    {/* Timeline spine */}
                    <div className="absolute left-[2.25rem] top-2 bottom-4 w-px bg-blue-100 border-l border-dashed border-blue-200" />

                    {hours.map((hourLabel, hi) => {
                        const absoluteHour = (startHour + hi) % 24;
                        const hourEvents = scheduleEvents.filter(e => e.hour === absoluteHour);
                        const isTopOfHour = hi % 2 === 0;

                        return (
                            <div key={hi} className="relative min-h-[48px] group">
                                {isTopOfHour && (
                                    <div className="absolute -left-12 text-[10px] font-bold text-gray-400 w-10 text-right pt-1 bg-white">
                                        {hourLabel}
                                    </div>
                                )}
                                <div className={`absolute -left-3 top-2 w-2 h-2 rounded-full ring-4 ring-white z-10 ${hourEvents.length > 0 ? "bg-blue-500 shadow-sm" : "bg-gray-200"
                                    }`} />

                                <div className="flex flex-col gap-1 pb-1">
                                    {hourEvents.map((event, ei) => {
                                        const evIdx = scheduleEvents.findIndex(e => e.hour === absoluteHour && scheduleEvents.indexOf(e) >= 0);
                                        const colors = EVENT_COLORS[event.colorIdx % EVENT_COLORS.length];
                                        return (
                                            <div
                                                key={ei}
                                                className={`${colors.bg} border-l-4 ${colors.border} rounded-r-xl px-3 py-2 cursor-pointer`}
                                                onClick={() => setEditingEvent(editingEvent === evIdx ? null : evIdx)}
                                            >
                                                {editingEvent === scheduleEvents.indexOf(event) ? (
                                                    <div className="space-y-1">
                                                        <input
                                                            type="text"
                                                            value={event.title}
                                                            onChange={(e) => updateEvent(scheduleEvents.indexOf(event), "title", e.target.value)}
                                                            className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-1 flex-wrap">
                                                            {EVENT_COLORS.map((c, ci) => (
                                                                <button
                                                                    key={ci}
                                                                    onClick={(ev) => { ev.stopPropagation(); updateEvent(scheduleEvents.indexOf(event), "colorIdx", ci); }}
                                                                    className={`w-4 h-4 rounded-full ${c.border.replace("border-l-", "bg-").replace("-400", "-400")} border-2 border-white ring-1 ${event.colorIdx === ci ? "ring-blue-500" : "ring-transparent"}`}
                                                                />
                                                            ))}
                                                            <input
                                                                type="text"
                                                                value={event.label}
                                                                onChange={(e) => updateEvent(scheduleEvents.indexOf(event), "label", e.target.value)}
                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.label} bg-transparent border-none outline-none focus:ring-0 w-16`}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setScheduleEvents(prev => prev.filter(ev => ev !== event)); setEditingEvent(null); }}
                                                                className="ml-auto text-red-400 hover:text-red-600 text-xs"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight">{event.title}</p>
                                                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${colors.label}`}>
                                                            {event.label}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Add event on hover */}
                                    {isTopOfHour && (
                                        <button
                                            type="button"
                                            onClick={() => addEvent(hi)}
                                            className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-400 hover:text-blue-600 transition-opacity text-left pl-2 py-1"
                                        >
                                            + Add event
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tasks Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Tasks</h3>
                    <button className="text-gray-400 font-black">⋯</button>
                </div>
                <div className="space-y-3">
                    {(tasks.length ? tasks : [{ text: "", checked: false, tag: "" }]).map((task, i) => (
                        <div key={i} className="flex items-center gap-3 group pb-2.5 border-b border-gray-50 last:border-b-0">
                            <button
                                type="button"
                                onClick={() => toggleTask(i)}
                                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all ${task.checked
                                        ? "bg-emerald-100 text-emerald-500"
                                        : "border-2 border-gray-200 hover:border-blue-400"
                                    }`}
                            >
                                {task.checked && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="text"
                                value={task.text}
                                onChange={(e) => updateTaskText(i, e.target.value)}
                                className={`flex-1 bg-transparent border-none outline-none text-sm p-0 focus:ring-0 ${task.checked ? "line-through text-gray-400" : "text-gray-800 font-medium"
                                    }`}
                                placeholder="Add a task..."
                            />
                            <div className="relative flex items-center gap-2">
                                {task.tag && (
                                    <button
                                        type="button"
                                        onClick={() => setShowTagMenu(showTagMenu?.type === "t" && showTagMenu?.idx === i ? null : { type: "t", idx: i })}
                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TASK_TAGS.find(t => t.label === task.tag)?.color || "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {task.tag}
                                    </button>
                                )}
                                {!task.tag && (
                                    <button
                                        type="button"
                                        onClick={() => setShowTagMenu({ type: "t", idx: i })}
                                        className="text-gray-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-full hover:bg-gray-100"
                                    >
                                        +Tag
                                    </button>
                                )}
                                <span className="text-gray-300 cursor-move text-sm leading-none">⋮⋮</span>
                                {showTagMenu?.type === "t" && showTagMenu?.idx === i && (
                                    <div className="absolute right-0 top-7 z-20 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 flex flex-col gap-1 w-28">
                                        {TASK_TAGS.map(tag => (
                                            <button
                                                key={tag.label}
                                                onClick={() => updateTaskTag(i, tag.label)}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl text-left ${tag.color} hover:opacity-80`}
                                            >
                                                {tag.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addTask} className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    <span className="text-base leading-none">+</span> Add a task...
                    <span className="ml-auto w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">+</span>
                </button>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Notes</h3>
                    <button className="text-gray-400 font-black">⋯</button>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-blue-300 mt-0.5 flex-shrink-0">📄</span>
                    <textarea
                        value={notesBlock?.data?.text || ""}
                        onChange={(e) => { if (notesBlock) updateBlock(notesBlock.id, { text: e.target.value }); }}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 font-medium resize-none min-h-[60px] focus:ring-0 p-0"
                        placeholder="Write a note..."
                    />
                </div>
            </div>
        </div>
    );
}
