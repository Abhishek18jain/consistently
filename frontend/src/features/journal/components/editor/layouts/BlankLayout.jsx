import { useState } from "react";
import { nanoid } from "nanoid";
import BlockEditor from "../BlockEditor";

/**
 * Blank Layout — light theme
 */

const BLOCK_OPTIONS = [
  { type: "text", label: "Text", icon: "Tt", color: "text-gray-600" },
  { type: "checklist", label: "Checklist", icon: "☑️", color: "text-emerald-500" },
  { type: "image", label: "Image", icon: "🖼️", color: "text-orange-500" },
  { type: "divider", label: "Divider", icon: "≡", color: "text-gray-500" },
];

const TOOLBAR_ITEMS = [
  { type: "text", label: "Text", icon: "Tt" },
  { type: "checklist", label: "Checklist", icon: "☑️" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "table", label: "Table", icon: "⊞" },
  { type: "divider", label: "Divider", icon: "≡" },
];

export default function BlankLayout({ template, blocks, setBlocks }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [title, setTitle] = useState(template?.name || "");

  const addBlock = (type) => {
    const newBlock = {
      id: nanoid(),
      type,
      data: type === "text" ? { text: "" }
        : type === "checklist" ? { items: [{ text: "", checked: false }] }
          : {},
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddMenu(false);
  };

  return (
    <div className="py-3 relative">
      {/* Title area */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none
                     outline-none placeholder-gray-400 focus:ring-0"
          placeholder="Enter title..."
        />
        {blocks.length === 0 && (
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Start writing or type '/' to add blocks
          </p>
        )}
      </div>

      {/* Block content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 min-h-[200px]">
        {blocks.length > 0 ? (
          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        ) : (
          <div className="flex items-start">
            <span className="text-gray-300 text-xl font-light">|</span>
          </div>
        )}
      </div>

      {/* Floating Add Block Button */}
      <div className="flex justify-end mt-4 relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className={`w-14 h-14 rounded-full text-white
                     shadow-lg flex items-center justify-center
                     transition-all duration-300 active:scale-90 z-10
                     ${showAddMenu
              ? "bg-gray-900 rotate-45 shadow-gray-400"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Add Block Menu */}
        {showAddMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-200
                          p-3 min-w-[160px] z-50 animate-[slideUp_200ms_ease-out]">
            <p className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase tracking-wide">Add Block</p>
            {BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => addBlock(opt.type)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                           text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900
                           transition-colors text-left"
              >
                <span className={`text-xl ${opt.color}`}>{opt.icon}</span>
                <span className="font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="mt-6 flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => addBlock(item.type)}
            className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl
                       hover:bg-gray-50 transition-colors min-w-[56px]"
          >
            <span className="text-xl text-gray-600 grayscale hover:grayscale-0 transition-all">{item.icon}</span>
            <span className="text-[10px] text-gray-500 font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
