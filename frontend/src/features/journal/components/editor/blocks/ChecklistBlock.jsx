import { useState } from "react";

export default function ChecklistBlock({ data, onChange }) {
  const items = data.items || [];

  // items can be strings or { text, checked } objects – normalize
  const normalizedItems = items.map((item) =>
    typeof item === "string"
      ? { text: item, checked: false }
      : { text: item.text || "", checked: !!item.checked }
  );

  const updateItem = (i, newText) => {
    const updated = [...normalizedItems];
    updated[i] = { ...updated[i], text: newText };
    onChange({ items: updated });
  };

  const toggleItem = (i) => {
    const updated = [...normalizedItems];
    updated[i] = { ...updated[i], checked: !updated[i].checked };
    onChange({ items: updated });
  };

  const removeItem = (i) => {
    const updated = normalizedItems.filter((_, idx) => idx !== i);
    onChange({ items: updated });
  };

  const addItem = () => {
    onChange({ items: [...normalizedItems, { text: "", checked: false }] });
  };

  return (
    <div className="space-y-0.5">
      {normalizedItems.map((item, i) => (
        <div
          key={i}
          className="group flex items-center gap-3 px-3 py-2.5
                     border-b border-zinc-700/40 last:border-b-0
                     hover:bg-zinc-800/40 transition-colors rounded-lg"
        >
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => toggleItem(i)}
            className={`
              flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${item.checked
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-zinc-500 hover:border-emerald-400 bg-zinc-800"
              }
            `}
          >
            {item.checked && (
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* Text input */}
          <input
            type="text"
            className={`
              flex-1 bg-transparent border-none outline-none text-sm
              focus:ring-0 placeholder-zinc-500
              ${item.checked
                ? "line-through text-zinc-500"
                : "text-zinc-200"
              }
            `}
            value={item.text}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder="Item…"
          />

          {/* Delete (show on hover) */}
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="opacity-0 group-hover:opacity-100 text-zinc-500
                       hover:text-red-400 transition-all text-xs p-1"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add item */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 px-3 py-2 text-sm
                   text-blue-400 hover:text-blue-300 transition-colors
                   font-medium"
      >
        <span className="text-base leading-none">+</span> Add item
      </button>
    </div>
  );
}