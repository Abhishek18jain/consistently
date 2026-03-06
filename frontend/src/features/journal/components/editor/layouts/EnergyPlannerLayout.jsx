import { useState, useRef } from "react";

/**
 * Energy Planner Layout - Light modern design matching screenshot
 * Energy slider → 3 zones: High / Medium / Low
 * Each task has: text, duration, tags, colored dot
 */

const ENERGY_ZONES = [
    {
        key: "high",
        label: "High Energy",
        range: [67, 100],
        bg: "bg-orange-50",
        border: "border-orange-100",
        headerText: "text-orange-700",
        dotColor: "bg-orange-500",
        sliderColor: "#f97316",
    },
    {
        key: "medium",
        label: "Medium Energy",
        range: [34, 66],
        bg: "bg-amber-50",
        border: "border-amber-100",
        headerText: "text-amber-700",
        dotColor: "bg-yellow-400",
        sliderColor: "#eab308",
    },
    {
        key: "low",
        label: "Low Energy",
        range: [0, 33],
        bg: "bg-blue-50",
        border: "border-blue-100",
        headerText: "text-blue-700",
        dotColor: "bg-blue-400",
        sliderColor: "#60a5fa",
    },
];

const TAG_COLORS = [
    "bg-purple-50 text-purple-600",
    "bg-blue-50 text-blue-600",
    "bg-emerald-50 text-emerald-600",
    "bg-rose-50 text-rose-600",
    "bg-amber-50 text-amber-600",
];

function parseZones(blocks) {
    const zones = { high: [], medium: [], low: [] };
    let currentZone = "high";
    let zoneIdx = 0;
    const zoneKeys = ["high", "medium", "low"];

    for (const block of blocks) {
        if (block.type === "text") {
            const txt = (block.data?.text || "").toLowerCase();
            if (txt.includes("high")) currentZone = "high";
            else if (txt.includes("medium") || txt.includes("mid")) currentZone = "medium";
            else if (txt.includes("low")) currentZone = "low";
            else {
                // Advance zone based on order
                if (zoneIdx < zoneKeys.length) {
                    currentZone = zoneKeys[zoneIdx++];
                }
            }
        } else if (block.type === "checklist") {
            const items = (block.data?.items || []).map((item) =>
                typeof item === "string"
                    ? { text: item, checked: false, duration: "", tag: "", tagColor: 0 }
                    : {
                        text: item.text || "",
                        checked: !!item.checked,
                        duration: item.duration || "",
                        tag: item.tag || "",
                        tagColor: item.tagColor ?? 0,
                        blockId: block.id,
                    }
            ).map(item => ({ ...item, blockId: block.id }));

            zones[currentZone] = [...zones[currentZone], ...items];
        }
    }

    return zones;
}

export default function EnergyPlannerLayout({ template, blocks, setBlocks }) {
    const [energyLevel, setEnergyLevel] = useState(80);
    const [addingTo, setAddingTo] = useState(null); // zone key
    const [newTaskText, setNewTaskText] = useState("");

    const zones = parseZones(blocks);

    // Which zone is highlighted based on slider
    const activeZone = ENERGY_ZONES.find((z) =>
        energyLevel >= z.range[0] && energyLevel <= z.range[1]
    );

    const updateItemInBlock = (blockId, items) => {
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === blockId ? { ...b, data: { items } } : b
            )
        );
    };

    const toggleItem = (zoneKey, itemIdx) => {
        const item = zones[zoneKey][itemIdx];
        if (!item?.blockId) return;

        const block = blocks.find(b => b.id === item.blockId);
        if (!block) return;

        // Find which item within this block corresponds to our item
        const blockItemIdx = (block.data?.items || []).findIndex((bi) => {
            const normalBi = typeof bi === "string" ? { text: bi, checked: false } : bi;
            return normalBi.text === item.text;
        });

        if (blockItemIdx < 0) return;

        const newItems = [...(block.data?.items || [])];
        if (typeof newItems[blockItemIdx] === "string") {
            newItems[blockItemIdx] = { text: newItems[blockItemIdx], checked: true };
        } else {
            newItems[blockItemIdx] = { ...newItems[blockItemIdx], checked: !newItems[blockItemIdx].checked };
        }
        updateItemInBlock(item.blockId, newItems);
    };

    const updateItemField = (zoneKey, itemIdx, field, value) => {
        const item = zones[zoneKey][itemIdx];
        if (!item?.blockId) return;

        const block = blocks.find(b => b.id === item.blockId);
        if (!block) return;

        const blockItemIdx = (block.data?.items || []).findIndex((bi) => {
            const normalBi = typeof bi === "string" ? { text: bi } : bi;
            return normalBi.text === item.text;
        });

        if (blockItemIdx < 0) return;

        const newItems = [...(block.data?.items || [])];
        if (typeof newItems[blockItemIdx] === "string") {
            newItems[blockItemIdx] = { text: newItems[blockItemIdx], checked: false, [field]: value };
        } else {
            newItems[blockItemIdx] = { ...newItems[blockItemIdx], [field]: value };
        }
        updateItemInBlock(item.blockId, newItems);
    };

    const addItemToBlock = (zoneKey) => {
        if (!newTaskText.trim()) return;

        const checklistBlock = blocks.find(b => b.type === "checklist" && (() => {
            return true; // fallback - use first checklist for zone
        })());

        // Find the right block for this zone
        let targetBlock = null;
        let currentZ = "high";
        let zIdx = 0;
        const zKeys = ["high", "medium", "low"];

        for (const block of blocks) {
            if (block.type === "text") {
                const txt = (block.data?.text || "").toLowerCase();
                if (txt.includes("high")) currentZ = "high";
                else if (txt.includes("medium") || txt.includes("mid")) currentZ = "medium";
                else if (txt.includes("low")) currentZ = "low";
                else {
                    if (zIdx < zKeys.length) currentZ = zKeys[zIdx++];
                }
            } else if (block.type === "checklist" && currentZ === zoneKey) {
                targetBlock = block;
                break;
            }
        }

        if (!targetBlock) {
            // Fall back to first checklist block
            targetBlock = blocks.find(b => b.type === "checklist");
        }

        if (!targetBlock) return;

        const newItem = { text: newTaskText.trim(), checked: false, duration: "", tag: "", tagColor: 0 };
        updateItemInBlock(targetBlock.id, [...(targetBlock.data?.items || []), newItem]);
        setNewTaskText("");
        setAddingTo(null);
    };

    // Slider gradient stops
    const sliderGradient = "linear-gradient(to right, #60a5fa 0%, #60a5fa 33%, #eab308 33%, #eab308 67%, #f97316 67%, #f97316 100%)";

    return (
        <div className="py-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-xl font-extrabold text-gray-900">
                    {template?.name || "Energy-Based Planner"}
                </h2>
            </div>

            {/* Energy Slider Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Energy Level</p>
                <div className="relative">
                    {/* Gradient bar */}
                    <div className="h-2 rounded-full" style={{ background: sliderGradient }} />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                    />
                    {/* Thumb indicator */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-orange-400 shadow-md pointer-events-none transition-all"
                        style={{ left: `calc(${energyLevel}% - 10px)` }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-gray-400">Low</span>
                    <span className="text-[10px] font-bold text-gray-400">Medium</span>
                    <span className="text-[10px] font-bold text-gray-400">High</span>
                </div>
            </div>

            {/* Zone Sections */}
            <div className="space-y-4">
                {ENERGY_ZONES.map((zone) => {
                    const items = zones[zone.key] || [];
                    const isActive = activeZone?.key === zone.key;

                    return (
                        <div
                            key={zone.key}
                            className={`rounded-3xl p-5 border ${zone.border} ${zone.bg} transition-all duration-300 ${isActive ? "shadow-md ring-2 ring-offset-1 ring-current ring-opacity-20" : "shadow-sm"}`}
                        >
                            <h3 className={`text-sm font-extrabold ${zone.headerText} mb-4 flex items-center gap-2`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${zone.dotColor}`} />
                                {zone.label}
                            </h3>

                            <div className="space-y-3">
                                {items.map((item, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-3.5 shadow-sm border border-white/80">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${zone.dotColor}`} />
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => updateItemField(zone.key, i, "text", e.target.value)}
                                                className="flex-1 text-sm font-bold text-gray-800 bg-transparent border-none outline-none p-0 focus:ring-0"
                                            />
                                            <input
                                                type="text"
                                                value={item.duration}
                                                onChange={(e) => updateItemField(zone.key, i, "duration", e.target.value)}
                                                className="w-10 text-xs font-bold text-gray-400 bg-transparent border-none outline-none p-0 focus:ring-0 text-right"
                                                placeholder="1h"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-5">
                                            {item.tag && (
                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${TAG_COLORS[item.tagColor % TAG_COLORS.length]}`}>
                                                    {item.tag}
                                                </span>
                                            )}
                                            <input
                                                type="text"
                                                value={item.tag}
                                                onChange={(e) => updateItemField(zone.key, i, "tag", e.target.value)}
                                                className="text-[10px] font-semibold text-gray-400 bg-transparent border-none outline-none p-0 focus:ring-0 w-16"
                                                placeholder="+ tag"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {addingTo === zone.key ? (
                                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-2">
                                        <input
                                            type="text"
                                            value={newTaskText}
                                            onChange={(e) => setNewTaskText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") addItemToBlock(zone.key);
                                                if (e.key === "Escape") { setAddingTo(null); setNewTaskText(""); }
                                            }}
                                            className="flex-1 text-sm font-semibold text-gray-800 bg-transparent border-none outline-none p-0 focus:ring-0"
                                            placeholder="New task..."
                                            autoFocus
                                        />
                                        <button onClick={() => addItemToBlock(zone.key)} className="text-xs font-bold text-blue-500">Add</button>
                                        <button onClick={() => { setAddingTo(null); setNewTaskText(""); }} className="text-xs text-gray-400">✕</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingTo(zone.key)}
                                        className={`flex items-center gap-1.5 text-xs font-bold ${zone.headerText} opacity-70 hover:opacity-100 transition-opacity`}
                                    >
                                        <span className="text-base leading-none">+</span> Add task
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
