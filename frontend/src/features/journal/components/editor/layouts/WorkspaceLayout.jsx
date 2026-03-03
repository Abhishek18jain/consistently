import { useState, useMemo } from "react";
import { nanoid } from "nanoid";

/**
 * Workspace Dashboard Layout — fully dark theme
 */

const WIDGET_TYPES = {
    checklist: { label: "Checklist", emoji: "☑️", color: "bg-emerald-500" },
    notes: { label: "Notes", emoji: "📝", color: "bg-amber-500" },
    calendar: { label: "Calendar", emoji: "📅", color: "bg-blue-500" },
    tasks: { label: "Tasks", emoji: "✅", color: "bg-purple-500" },
};

const DAYS_IN_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

function MiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <button className="text-zinc-500 hover:text-zinc-300 text-xs">‹</button>
                <span className="text-xs font-semibold text-zinc-300">{monthName}</span>
                <button className="text-zinc-500 hover:text-zinc-300 text-xs">›</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
                {DAYS_IN_WEEK.map((d, i) => (
                    <span key={i} className="text-[9px] text-zinc-500 font-medium py-0.5">{d}</span>
                ))}
                {cells.map((day, i) => (
                    <button
                        key={i}
                        className={`text-[10px] py-0.5 rounded-full transition-colors
              ${day === today
                                ? "bg-blue-500 text-white font-bold"
                                : day ? "text-zinc-400 hover:bg-zinc-700/50" : ""
                            }`}
                    >
                        {day || ""}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ChecklistWidget({ items, onChange }) {
    const toggleItem = (idx) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
        onChange(updated);
    };

    const updateText = (idx, text) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], text };
        onChange(updated);
    };

    const addItem = () => {
        onChange([...items, { text: "", checked: false }]);
    };

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleItem(i)}
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all
              ${item.checked ? "bg-blue-500 border-blue-500 text-white" : "border-zinc-500 bg-zinc-700/50"}`}
                    >
                        {item.checked && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                    <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateText(i, e.target.value)}
                        className={`flex-1 text-xs bg-transparent border-none outline-none
              ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}`}
                        placeholder="Add item..."
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="text-xs text-zinc-500 hover:text-blue-400 font-medium flex items-center gap-1"
            >
                <span>+</span> Add item...
            </button>
        </div>
    );
}

function NotesWidget({ text, onChange }) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-zinc-500 text-xs mt-0.5">📄</span>
            <textarea
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 text-xs text-zinc-300 bg-transparent border-none outline-none resize-none min-h-[40px]"
                placeholder="Write a note..."
            />
        </div>
    );
}

function TasksWidget({ items, onChange }) {
    const toggleItem = (idx) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
        onChange(updated);
    };

    const updateText = (idx, text) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], text };
        onChange(updated);
    };

    const addItem = () => {
        onChange([...items, { text: "", checked: false }]);
    };

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleItem(i)}
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all
              ${item.checked ? "bg-purple-500 border-purple-500 text-white" : "border-zinc-500 bg-zinc-700/50"}`}
                    >
                        {item.checked && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                    <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateText(i, e.target.value)}
                        className={`flex-1 text-xs bg-transparent border-none outline-none
              ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}`}
                        placeholder="Add task..."
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="text-xs text-zinc-500 hover:text-purple-400 font-medium flex items-center gap-1"
            >
                <span>+</span> Add a task...
            </button>
        </div>
    );
}

export default function WorkspaceLayout({ template, blocks, setBlocks }) {
    const [widgets, setWidgets] = useState(() => {
        const defaultWidgets = [
            { id: "checklist", type: "checklist", data: { items: [{ text: "", checked: false }, { text: "", checked: false }, { text: "", checked: false }] } },
            { id: "calendar", type: "calendar", data: {} },
            { id: "notes", type: "notes", data: { text: "" } },
            { id: "tasks", type: "tasks", data: { items: [{ text: "", checked: false }, { text: "", checked: false }] } },
        ];

        if (blocks.length > 0) {
            const checklistBlock = blocks.find(b => b.type === "checklist");
            const textBlock = blocks.find(b => b.type === "text");
            if (checklistBlock) {
                defaultWidgets[0].data.items = (checklistBlock.data?.items || []).map(item =>
                    typeof item === "string" ? { text: item, checked: false } : { text: item.text || "", checked: !!item.checked }
                );
            }
            if (textBlock) {
                defaultWidgets[2].data.text = textBlock.data?.text || "";
            }
        }
        return defaultWidgets;
    });

    const updateWidget = (id, newData) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, data: newData } : w));

        const widget = widgets.find(w => w.id === id);
        if (widget?.type === "checklist" || widget?.type === "tasks") {
            const checklistBlock = blocks.find(b => b.type === "checklist");
            if (checklistBlock) {
                setBlocks(prev => prev.map(b =>
                    b.id === checklistBlock.id ? { ...b, data: { items: newData.items } } : b
                ));
            }
        } else if (widget?.type === "notes") {
            const textBlock = blocks.find(b => b.type === "text");
            if (textBlock) {
                setBlocks(prev => prev.map(b =>
                    b.id === textBlock.id ? { ...b, data: { text: newData.text } } : b
                ));
            }
        }
    };

    const addWidget = (type) => {
        const newWidget = {
            id: nanoid(),
            type,
            data: type === "notes" ? { text: "" } : { items: [{ text: "", checked: false }] },
        };
        setWidgets(prev => [...prev, newWidget]);
    };

    return (
        <div className="py-3">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-zinc-100">
                    {template?.name || "Custom Workspace"}
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Your personalized workspace"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {widgets.map((widget) => {
                    const meta = WIDGET_TYPES[widget.type] || WIDGET_TYPES.checklist;
                    return (
                        <div
                            key={widget.id}
                            className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50
                         hover:border-zinc-600/50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-zinc-200">{meta.label}</h4>
                                <button className="text-zinc-500 hover:text-zinc-300 text-xs">⋯</button>
                            </div>

                            {widget.type === "checklist" && (
                                <ChecklistWidget
                                    items={widget.data.items || []}
                                    onChange={(items) => updateWidget(widget.id, { items })}
                                />
                            )}
                            {widget.type === "calendar" && <MiniCalendar />}
                            {widget.type === "notes" && (
                                <NotesWidget
                                    text={widget.data.text || ""}
                                    onChange={(text) => updateWidget(widget.id, { text })}
                                />
                            )}
                            {widget.type === "tasks" && (
                                <TasksWidget
                                    items={widget.data.items || []}
                                    onChange={(items) => updateWidget(widget.id, { items })}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                {Object.entries(WIDGET_TYPES).map(([key, meta]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => addWidget(key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-zinc-800/60 border border-zinc-700/50
                       text-xs font-medium text-zinc-300 hover:bg-zinc-700/60
                       hover:text-zinc-100 transition-colors"
                    >
                        <span className={`w-3 h-3 rounded-sm ${meta.color}`} />
                        {meta.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-center mt-5">
                <button
                    type="button"
                    onClick={() => addWidget("checklist")}
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
