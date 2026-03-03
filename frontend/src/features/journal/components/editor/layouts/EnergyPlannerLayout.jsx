import { useMemo } from "react";

/**
 * Energy Planner Layout — fully dark theme
 */

const ENERGY_LEVELS = [
    {
        label: "High Energy",
        emoji: "🔥",
        description: "Deep work, complex tasks",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        labelColor: "text-orange-400",
        iconBg: "bg-orange-500/20",
        addColor: "text-orange-400 hover:text-orange-300",
    },
    {
        label: "Medium Energy",
        emoji: "⚡",
        description: "Meetings, collaboration",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        labelColor: "text-blue-400",
        iconBg: "bg-blue-500/20",
        addColor: "text-blue-400 hover:text-blue-300",
    },
    {
        label: "Low Energy",
        emoji: "🌙",
        description: "Admin, routine tasks",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        labelColor: "text-emerald-400",
        iconBg: "bg-emerald-500/20",
        addColor: "text-emerald-400 hover:text-emerald-300",
    },
];

function parseZones(blocks) {
    const zones = [];
    let current = null;

    for (const block of blocks) {
        if (block.type === "text") {
            if (current) zones.push(current);
            current = { title: block.data?.text || "", items: [], titleBlockId: block.id };
        } else if (block.type === "checklist" && current) {
            current.items = (block.data?.items || []).map((item) =>
                typeof item === "string"
                    ? { text: item, checked: false }
                    : { text: item.text || "", checked: !!item.checked }
            );
            current.checklistBlockId = block.id;
        }
    }
    if (current) zones.push(current);

    while (zones.length < 3) {
        zones.push({
            title: ENERGY_LEVELS[zones.length]?.label || "",
            items: [],
        });
    }

    return zones.slice(0, 3);
}

export default function EnergyPlannerLayout({ template, blocks, setBlocks }) {
    const zones = parseZones(blocks);

    const updateZoneItems = (zoneIdx, newItems) => {
        const zone = zones[zoneIdx];
        if (!zone?.checklistBlockId) return;
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === zone.checklistBlockId
                    ? { ...b, data: { items: newItems } }
                    : b
            )
        );
    };

    const toggleItem = (zoneIdx, itemIdx) => {
        const items = [...zones[zoneIdx].items];
        items[itemIdx] = { ...items[itemIdx], checked: !items[itemIdx].checked };
        updateZoneItems(zoneIdx, items);
    };

    const updateItemText = (zoneIdx, itemIdx, text) => {
        const items = [...zones[zoneIdx].items];
        items[itemIdx] = { ...items[itemIdx], text };
        updateZoneItems(zoneIdx, items);
    };

    const addItem = (zoneIdx) => {
        const items = [...zones[zoneIdx].items, { text: "", checked: false }];
        updateZoneItems(zoneIdx, items);
    };

    const removeItem = (zoneIdx, itemIdx) => {
        const items = zones[zoneIdx].items.filter((_, i) => i !== itemIdx);
        updateZoneItems(zoneIdx, items);
    };

    const totalTasks = zones.reduce((sum, z) => sum + z.items.length, 0);
    const completedTasks = zones.reduce((sum, z) => sum + z.items.filter(i => i.checked).length, 0);

    return (
        <div className="py-3">
            <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                    {template?.name || "Energy Planner"} ⚡
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                    {template?.description || "Plan tasks based on your energy level"}
                </p>
            </div>

            {totalTasks > 0 && (
                <div className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50 mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-zinc-300">Today's Progress</span>
                        <span className="text-sm font-bold text-zinc-100">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-blue-400 to-emerald-400 transition-all duration-500"
                            style={{ width: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {zones.map((zone, zi) => {
                    const style = ENERGY_LEVELS[zi];
                    const completedInZone = zone.items.filter(i => i.checked).length;
                    return (
                        <div
                            key={zi}
                            className={`rounded-2xl border ${style.border} overflow-hidden bg-zinc-800/40`}
                        >
                            <div className={`${style.bg} px-4 py-3 flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center text-lg`}>
                                        {style.emoji}
                                    </span>
                                    <div>
                                        <h4 className={`text-sm font-semibold ${style.labelColor}`}>
                                            {style.label}
                                        </h4>
                                        <p className="text-[10px] text-zinc-500">{style.description}</p>
                                    </div>
                                </div>
                                {zone.items.length > 0 && (
                                    <span className={`text-xs font-medium ${style.labelColor} opacity-70`}>
                                        {completedInZone}/{zone.items.length}
                                    </span>
                                )}
                            </div>

                            <div className="px-4 py-2">
                                {zone.items.map((item, ii) => (
                                    <div
                                        key={ii}
                                        className="group flex items-center gap-3 py-2.5 border-b border-zinc-700/30 last:border-b-0"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(zi, ii)}
                                            className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-2
                        flex items-center justify-center transition-all
                        ${item.checked
                                                    ? "bg-emerald-500 border-emerald-500 text-white scale-110"
                                                    : "border-zinc-500 bg-zinc-700/50 hover:border-zinc-400"
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
                                            onChange={(e) => updateItemText(zi, ii, e.target.value)}
                                            className={`
                        flex-1 bg-transparent border-none outline-none text-sm
                        ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}
                      `}
                                            placeholder="Add task…"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem(zi, ii)}
                                            className="opacity-0 group-hover:opacity-100 text-zinc-500
                                 hover:text-red-400 text-xs transition-all"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addItem(zi)}
                                    className={`flex items-center gap-1 text-xs font-medium py-2 transition-colors ${style.addColor}`}
                                >
                                    <span className="text-sm">+</span> Add task
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
