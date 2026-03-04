import { useState } from "react";

/**
 * Eisenhower Matrix Layout — fully light theme
 */

const QUADRANT_STYLES = [
  {
    label: "Urgent & Important",
    labelColor: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-200",
    cardBg: "bg-white",
    accent: "border-l-red-500",
  },
  {
    label: "Important Not Urgent",
    labelColor: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
    cardBg: "bg-white",
    accent: "border-l-blue-500",
  },
  {
    label: "Urgent Not Important",
    labelColor: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-200",
    cardBg: "bg-white",
    accent: "border-l-amber-500",
  },
  {
    label: "Not Urgent Not Important",
    labelColor: "text-emerald-700",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    cardBg: "bg-white",
    accent: "border-l-emerald-500",
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
        <h2 className="text-xl font-bold text-gray-900">
          {template?.name || "Eisenhower Matrix"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {template?.description || "Prioritize tasks by urgency and importance"}
        </p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quadrants.map((quad, qi) => {
          const style = QUADRANT_STYLES[qi];
          return (
            <div
              key={qi}
              className={`
                rounded-2xl overflow-hidden border ${style.border}
                min-h-[180px] flex flex-col bg-gray-50 shadow-sm
              `}
            >
              {/* Quadrant Label Header */}
              <div className={`${style.bg} px-3 py-2 border-b ${style.border}`}>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider ${style.labelColor}`}>
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
                      border border-gray-200 border-l-4 ${style.accent}
                      hover:shadow-sm hover:border-gray-300 transition-all
                      flex items-start gap-2
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(qi, ii)}
                      className={`
                        flex-shrink-0 w-4 h-4 rounded border-2 mt-0.5
                        flex items-center justify-center transition-all cursor-pointer
                        ${item.checked
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-gray-300 hover:border-emerald-400 bg-white"
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
                        focus:ring-0 p-0
                        ${item.checked ? "line-through text-gray-400" : "text-gray-800"}
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
                  mx-3 mb-3 flex items-center gap-1.5 text-[11px] font-semibold
                  ${style.labelColor} opacity-70 hover:opacity-100 transition-opacity
                `}
              >
                <span className="text-base leading-none">+</span> Add task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
