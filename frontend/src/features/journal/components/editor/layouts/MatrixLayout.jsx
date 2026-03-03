import { useState } from "react";

/**
 * Eisenhower Matrix Layout — fully dark theme
 */

const QUADRANT_STYLES = [
  {
    label: "Urgent & Important",
    labelColor: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    cardBg: "bg-zinc-800/60",
    accent: "border-l-red-500/60",
  },
  {
    label: "Important Not Urgent",
    labelColor: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    cardBg: "bg-zinc-800/60",
    accent: "border-l-blue-500/60",
  },
  {
    label: "Urgent Not Important",
    labelColor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    cardBg: "bg-zinc-800/60",
    accent: "border-l-amber-500/60",
  },
  {
    label: "Not Urgent Not Important",
    labelColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    cardBg: "bg-zinc-800/60",
    accent: "border-l-emerald-500/60",
  },
];

function parseQuadrants(blocks) {
  const quads = [];
  let current = null;

  for (const block of blocks) {
    if (block.type === "text") {
      if (current) quads.push(current);
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
  if (current) quads.push(current);

  while (quads.length < 4) {
    quads.push({ title: QUADRANT_STYLES[quads.length]?.label || "", items: [] });
  }

  return quads.slice(0, 4);
}

export default function MatrixLayout({ template, blocks, setBlocks }) {
  const quadrants = parseQuadrants(blocks);

  const updateQuadrantItems = (quadIdx, newItems) => {
    const quad = quadrants[quadIdx];
    if (!quad?.checklistBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === quad.checklistBlockId
          ? { ...b, data: { items: newItems } }
          : b
      )
    );
  };

  const toggleItem = (quadIdx, itemIdx) => {
    const items = [...quadrants[quadIdx].items];
    items[itemIdx] = { ...items[itemIdx], checked: !items[itemIdx].checked };
    updateQuadrantItems(quadIdx, items);
  };

  const updateItemText = (quadIdx, itemIdx, text) => {
    const items = [...quadrants[quadIdx].items];
    items[itemIdx] = { ...items[itemIdx], text };
    updateQuadrantItems(quadIdx, items);
  };

  const addItem = (quadIdx) => {
    const items = [...quadrants[quadIdx].items, { text: "", checked: false }];
    updateQuadrantItems(quadIdx, items);
  };

  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-100">
          {template?.name || "Eisenhower Matrix"}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {template?.description || "Prioritize tasks by urgency and importance"}
        </p>
      </div>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quadrants.map((quad, qi) => {
          const style = QUADRANT_STYLES[qi];
          return (
            <div
              key={qi}
              className={`
                rounded-2xl overflow-hidden border ${style.border}
                min-h-[180px] flex flex-col bg-zinc-800/40
              `}
            >
              {/* Quadrant Label Header */}
              <div className={`${style.bg} px-3 py-2`}>
                <h3 className={`text-[11px] font-semibold uppercase tracking-wider ${style.labelColor}`}>
                  {style.label}
                </h3>
              </div>

              {/* Task Cards */}
              <div className="flex-1 p-3 space-y-2">
                {quad.items.map((item, ii) => (
                  <div
                    key={ii}
                    className={`
                      group ${style.cardBg} rounded-xl p-2.5
                      border-l-3 ${style.accent}
                      hover:bg-zinc-700/50 transition-colors
                      flex items-start gap-2
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(qi, ii)}
                      className={`
                        flex-shrink-0 w-4 h-4 rounded border-2 mt-0.5
                        flex items-center justify-center transition-all
                        ${item.checked
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-zinc-500 hover:border-zinc-400 bg-zinc-700/50"
                        }
                      `}
                    >
                      {item.checked && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateItemText(qi, ii, e.target.value)}
                      className={`
                        flex-1 bg-transparent border-none outline-none text-xs font-medium
                        ${item.checked ? "line-through text-zinc-500" : "text-zinc-200"}
                      `}
                      placeholder="New task…"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addItem(qi)}
                className={`
                  mx-3 mb-2 flex items-center gap-1 text-[11px] font-medium
                  ${style.labelColor} opacity-70 hover:opacity-100 transition-opacity
                `}
              >
                <span className="text-xs">+</span> Add task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
