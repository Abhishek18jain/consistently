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
    <div className="space-y-1">
      {normalizedItems.map((item, i) => (
        <div
          key={i}
          className="group flex items-center gap-3 px-3 py-2.5 bg-white
                     border border-gray-100 rounded-xl shadow-sm
                     hover:border-gray-300 hover:shadow-md transition-all duration-200"
        >
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => toggleItem(i)}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${item.checked
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-gray-300 hover:border-emerald-400 bg-white"
              }
            `}
          >
            {item.checked && (
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
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
              focus:ring-0 placeholder-gray-400
              ${item.checked
                ? "line-through text-gray-400"
                : "text-gray-800"
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
            className="opacity-0 group-hover:opacity-100 text-gray-400
                       hover:text-red-500 hover:bg-red-50 transition-all duration-200
                       w-6 h-6 flex items-center justify-center rounded-md"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add item */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-3 py-2 text-sm mt-3 ml-1
                   text-gray-500 hover:text-gray-900 transition-colors
                   font-medium"
      >
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          +
        </div>
        Add item
      </button>
    </div>
  );
}