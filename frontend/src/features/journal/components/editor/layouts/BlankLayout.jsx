import { useState } from "react";
import { nanoid } from "nanoid";
import BlockEditor from "../BlockEditor";

/**
 * Blank Layout — matches the "Blank Editor" screenshot
 *
 * Features:
 * - Clean title input with placeholder
 * - "Start writing or type '/' to add blocks" hint
 * - Floating "Add Block" menu with Text, Checklist, Image, Drawing options
 * - Bottom toolbar with quick-add icons
 */

const BLOCK_OPTIONS = [
  { type: "text", label: "Text", icon: "Tt", color: "text-zinc-300" },
  { type: "checklist", label: "Checklist", icon: "☑️", color: "text-emerald-400" },
  { type: "image", label: "Image", icon: "🖼️", color: "text-orange-400" },
  { type: "divider", label: "Divider", icon: "≡", color: "text-zinc-400" },
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
          className="w-full text-2xl font-bold text-zinc-100 bg-transparent border-none
                     outline-none placeholder-zinc-500"
          placeholder="Enter title..."
        />
        {blocks.length === 0 && (
          <p className="text-sm text-zinc-500 mt-2">
            Start writing or type '/' to add blocks
          </p>
        )}
      </div>

      {/* Block content */}
      <div className="bg-zinc-800/40 rounded-2xl border border-zinc-700/30 p-5 min-h-[200px]">
        {blocks.length > 0 ? (
          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        ) : (
          <div className="flex items-start">
            <span className="text-zinc-600 text-sm">|</span>
          </div>
        )}
      </div>

      {/* Floating Add Block Button */}
      <div className="flex justify-end mt-4 relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className={`w-12 h-12 rounded-full text-white
                     shadow-lg flex items-center justify-center
                     transition-all active:scale-90
                     ${showAddMenu
              ? "bg-blue-600 rotate-45 shadow-blue-500/30"
              : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30"
            }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Add Block Menu */}
        {showAddMenu && (
          <div className="absolute bottom-16 right-0 bg-zinc-800 rounded-2xl shadow-xl border border-zinc-700
                         p-3 min-w-[160px] z-50">
            <p className="text-xs font-semibold text-zinc-300 mb-2 px-1">Add Block</p>
            {BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => addBlock(opt.type)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-sm text-zinc-300 hover:bg-zinc-700/60 transition-colors text-left"
              >
                <span className={`text-base ${opt.color}`}>{opt.icon}</span>
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="mt-6 flex items-center justify-center gap-1 bg-zinc-800/50 rounded-2xl
                      border border-zinc-700/30 p-2">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => addBlock(item.type)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                       hover:bg-zinc-700/50 transition-colors min-w-[52px]"
          >
            <span className="text-base text-zinc-300">{item.icon}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
