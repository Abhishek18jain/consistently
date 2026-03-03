// components/editor/Toolbar.jsx

import { nanoid } from "nanoid";

export default function Toolbar({ onAddBlock }) {
  function add(type) {
    onAddBlock({
      id: nanoid(),
      type,
      data: {},
    });
  }

  return (
    <div className="flex gap-2 mb-4 border-b border-zinc-700/50 pb-2">
      <button onClick={() => add("text")} className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Text</button>
      <button onClick={() => add("checklist")} className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Checklist</button>
      <button onClick={() => add("image")} className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Image</button>
      <button onClick={() => add("divider")} className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Divider</button>
    </div>
  );
}