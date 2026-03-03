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
    <div className="flex gap-2 mb-4 border-b pb-2">
      <button onClick={() => add("text")}>Text</button>
      <button onClick={() => add("checklist")}>Checklist</button>
      <button onClick={() => add("image")}>Image</button>
      <button onClick={() => add("divider")}>Divider</button>
    </div>
  );
}