import { useState } from "react";
import { nanoid } from "nanoid";

/**
 * Workspace Dashboard Layout — Exactly matching screenshot
 * 2x2 grid: Checklist | Calendar
 *           Notes     | Tasks
 * Bottom toolbar with widget type buttons
 */

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const WIDGET_TYPES = {
    checklist: { label: "Checklist", emoji: "☑️", bgDot: "bg-emerald-500", border: "border-emerald-200", headerBg: "bg-emerald-50", headerText: "text-emerald-600" },
    calendar: { label: "Calendar", emoji: "📅", bgDot: "bg-blue-500", border: "border-blue-200", headerBg: "bg-blue-50", headerText: "text-blue-600" },
    notes: { label: "Notes", emoji: "📝", bgDot: "bg-amber-500", border: "border-amber-200", headerBg: "bg-amber-50", headerText: "text-amber-600" },
    tasks: { label: "Tasks", emoji: "✅", bgDot: "bg-purple-500", border: "border-purple-200", headerBg: "bg-purple-50", headerText: "text-purple-600" },
};

function MiniCalendar() {
    const [offset, setOffset] = useState(0);
    const base = new Date();
    base.setMonth(base.getMonth() + offset);
    const year = base.getFullYear();
    const month = base.getMonth();
    const today = new Date();

    const monthName = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => setOffset(o => o - 1)} className="text-gray-400 hover:text-gray-700 px-2 py-1 text-sm">‹</button>
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">{monthName}</span>
                <button onClick={() => setOffset(o => o + 1)} className="text-gray-400 hover:text-gray-700 px-2 py-1 text-sm">›</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
                {DAYS.map((d, i) => (
                    <span key={i} className="text-[9px] font-bold text-gray-400 py-1">{d}</span>
                ))}
                {cells.map((day, i) => (
                    <button key={i} className={`text-[11px] py-1 rounded transition-colors ${isToday(day)
                            ? "bg-blue-600 text-white font-bold shadow-sm"
                            : day ? "text-gray-700 hover:bg-gray-100 font-medium" : ""
                        }`}>
                        {day || ""}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ChecklistWidget({ items, onChange }) {
    const toggle = (i) => {
        const u = [...items];
        u[i] = { ...u[i], checked: !u[i].checked };
        onChange(u);
    };
    const updateText = (i, text) => {
        const u = [...items];
        u[i] = { ...u[i], text };
        onChange(u);
    };
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                    <button type="button" onClick={() => toggle(i)}
                        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 bg-white hover:border-emerald-400"
                            }`}>
                        {item.checked && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <input type="text" value={item.text} onChange={(e) => updateText(i, e.target.value)}
                        className={`flex-1 text-xs bg-transparent outline-none border-none focus:ring-0 p-0 ${item.checked ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}
                        placeholder="Add item..." />
                </div>
            ))}
            <button type="button" onClick={() => onChange([...items, { text: "", checked: false }])}
                className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 flex items-center gap-1 mt-2 uppercase tracking-wide transition-colors">
                <span className="text-sm">+</span> Add item...
            </button>
        </div>
    );
}

function TasksWidget({ items, onChange }) {
    const toggle = (i) => {
        const u = [...items];
        u[i] = { ...u[i], checked: !u[i].checked };
        onChange(u);
    };
    const updateText = (i, text) => {
        const u = [...items];
        u[i] = { ...u[i], text };
        onChange(u);
    };
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                    <button type="button" onClick={() => toggle(i)}
                        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.checked ? "bg-purple-500 border-purple-500 text-white" : "border-gray-300 bg-white hover:border-purple-400"
                            }`}>
                        {item.checked && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <input type="text" value={item.text} onChange={(e) => updateText(i, e.target.value)}
                        className={`flex-1 text-xs bg-transparent outline-none border-none focus:ring-0 p-0 ${item.checked ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}
                        placeholder="Add task..." />
                </div>
            ))}
            <button type="button" onClick={() => onChange([...items, { text: "", checked: false }])}
                className="text-[10px] font-bold text-gray-400 hover:text-purple-600 flex items-center gap-1 mt-2 uppercase tracking-wide transition-colors">
                <span className="text-sm">+</span> Add a task...
            </button>
        </div>
    );
}

export default function WorkspaceLayout({ template, blocks, setBlocks }) {
    const [widgets, setWidgets] = useState(() => {
        const checklistBlock = blocks.find(b => b.type === "checklist");
        const textBlock = blocks.find(b => b.type === "text");

        return [
            {
                id: "checklist",
                type: "checklist",
                data: {
                    items: (checklistBlock?.data?.items || [{ text: "", checked: false }, { text: "", checked: false }, { text: "", checked: false }])
                        .map(item => typeof item === "string" ? { text: item, checked: false } : { text: item.text || "", checked: !!item.checked }),
                },
            },
            { id: "calendar", type: "calendar", data: {} },
            {
                id: "notes",
                type: "notes",
                data: { text: textBlock?.data?.text || "" },
            },
            {
                id: "tasks",
                type: "tasks",
                data: { items: [{ text: "", checked: false }, { text: "", checked: false }] },
            },
        ];
    });

    const updateWidget = (id, newData) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, data: newData } : w));
        const widget = widgets.find(w => w.id === id);
        if (widget?.type === "checklist") {
            const b = blocks.find(b => b.type === "checklist");
            if (b) setBlocks(prev => prev.map(bl => bl.id === b.id ? { ...bl, data: { items: newData.items } } : bl));
        } else if (widget?.type === "notes") {
            const b = blocks.find(b => b.type === "text");
            if (b) setBlocks(prev => prev.map(bl => bl.id === b.id ? { ...bl, data: { text: newData.text } } : bl));
        }
    };

    const addWidget = (type) => {
        setWidgets(prev => [...prev, {
            id: nanoid(),
            type,
            data: type === "notes" ? { text: "" } : { items: [{ text: "", checked: false }] },
        }]);
    };

    return (
        <div className="py-3 pb-24 relative" style={{ background: "#f0eeff", minHeight: "100%" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <button className="text-gray-400 text-lg">‹</button>
                <h2 className="text-lg font-extrabold text-gray-900">Custom Workspace</h2>
                <button className="text-blue-500 text-xl font-medium">+</button>
            </div>

            {/* 2x2 Widget Grid */}
            <div className="grid grid-cols-2 gap-3">
                {widgets.map((widget) => {
                    const meta = WIDGET_TYPES[widget.type] || WIDGET_TYPES.checklist;
                    return (
                        <div
                            key={widget.id}
                            className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {/* Widget Header */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-extrabold text-gray-800">{meta.label}</span>
                                <button className="text-gray-300 hover:text-gray-600 text-sm font-bold">⋯</button>
                            </div>

                            {widget.type === "checklist" && (
                                <ChecklistWidget items={widget.data.items || []} onChange={(items) => updateWidget(widget.id, { items })} />
                            )}
                            {widget.type === "calendar" && <MiniCalendar />}
                            {widget.type === "notes" && (
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-400 text-sm mt-0.5">📄</span>
                                    <textarea
                                        value={widget.data.text || ""}
                                        onChange={(e) => updateWidget(widget.id, { text: e.target.value })}
                                        className="flex-1 text-xs text-gray-700 font-medium bg-transparent border-none outline-none resize-none min-h-[80px] focus:ring-0 p-0 placeholder-gray-400"
                                        placeholder="Write a note..."
                                    />
                                </div>
                            )}
                            {widget.type === "tasks" && (
                                <TasksWidget items={widget.data.items || []} onChange={(items) => updateWidget(widget.id, { items })} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Widget Toolbar — bottom bar */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 z-30">
                {Object.entries(WIDGET_TYPES).map(([key, meta]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => addWidget(key)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 hover:text-gray-900 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                    </button>
                ))}
            </div>

            {/* Floating Add Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => addWidget("checklist")}
                    className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200 flex items-center justify-center text-2xl active:scale-90 transition-transform"
                >
                    +
                </button>
            </div>
        </div>
    );
}
