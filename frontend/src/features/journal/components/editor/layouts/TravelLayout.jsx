import { useState } from "react";

/**
 * Travel Journal Layout — fully dark theme
 */

const MOODS = [
  { emoji: "😢", label: "Sad" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😊", label: "Good" },
  { emoji: "😍", label: "Amazing" },
];

export default function TravelLayout({ template, blocks, setBlocks }) {
  const textBlocks = blocks.filter((b) => b.type === "text");
  const checklistBlock = blocks.find((b) => b.type === "checklist");

  const titleBlock = textBlocks[0] || null;
  const notesBlock = textBlocks[1] || null;

  const moodItems = checklistBlock?.data?.items || [];
  const currentMoodText =
    typeof moodItems[0] === "string"
      ? moodItems[0]
      : moodItems[0]?.text || "";
  const moodMatch = currentMoodText.match(/Mood:\s*(.+)/i);
  const selectedMood = moodMatch ? moodMatch[1].trim() : "";

  const updateBlock = (blockId, newData) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, data: newData } : b))
    );
  };

  const setMood = (moodLabel) => {
    if (!checklistBlock) return;
    const newItems = [`Mood: ${moodLabel}`];
    updateBlock(checklistBlock.id, { items: newItems });
  };

  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-100">
          {template?.name || "Travel Journal"}
        </h2>
        <p className="text-sm text-zinc-400 mt-0.5">
          {template?.description || "Capture trip memories"}
        </p>
      </div>

      {/* Title + Notes Card */}
      <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 p-5 mb-5">
        {titleBlock && (
          <div className="border-l-4 border-blue-500/50 pl-4 mb-4">
            <input
              type="text"
              value={titleBlock.data?.text || ""}
              onChange={(e) =>
                updateBlock(titleBlock.id, { text: e.target.value })
              }
              className="text-lg font-bold text-zinc-100 bg-transparent border-none outline-none w-full"
              placeholder="Trip title…"
            />
          </div>
        )}

        {notesBlock && (
          <textarea
            value={notesBlock.data?.text || ""}
            onChange={(e) =>
              updateBlock(notesBlock.id, { text: e.target.value })
            }
            className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 placeholder-zinc-500 resize-y min-h-[100px] leading-relaxed"
            placeholder="Start writing your thoughts and memories…"
          />
        )}
      </div>

      {/* Image Upload Placeholder */}
      <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 overflow-hidden mb-5">
        <div className="bg-zinc-700/30 m-4 rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-zinc-700/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-2">
            <span className="text-2xl text-zinc-400">+</span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Add photos</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">How was it?</h3>
        <div className="flex items-center gap-3 justify-center">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              type="button"
              onClick={() => setMood(mood.label)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                transition-all duration-200 active:scale-90
                ${selectedMood === mood.label
                  ? "bg-blue-500/20 ring-2 ring-blue-400 ring-offset-2 ring-offset-zinc-900 scale-110"
                  : "bg-zinc-700/50 hover:bg-zinc-700"
                }
              `}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-center text-xs text-zinc-500 mt-2 font-medium">
            Feeling: {selectedMood}
          </p>
        )}
      </div>
    </div>
  );
}
