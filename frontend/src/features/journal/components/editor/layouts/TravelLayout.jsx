/**
 * Travel Journal Layout — light theme
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
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {template?.name || "Travel Journal"}
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-0.5">
          {template?.description || "Capture trip memories"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5 hover:border-blue-200 transition-colors">
        {titleBlock && (
          <div className="border-l-4 border-blue-500 pl-4 mb-5">
            <input
              type="text"
              value={titleBlock.data?.text || ""}
              onChange={(e) =>
                updateBlock(titleBlock.id, { text: e.target.value })
              }
              className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none w-full focus:ring-0 p-0"
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
            className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 font-medium resize-y min-h-[120px] leading-relaxed focus:ring-0 p-0"
            placeholder="Start writing your thoughts and memories…"
          />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5 group cursor-pointer hover:border-gray-300 transition-all">
        <div className="bg-gray-50 m-4 rounded-xl flex flex-col items-center justify-center py-12 group-hover:bg-gray-100 transition-colors border border-dashed border-gray-300">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-3">
            <span className="text-3xl text-gray-400">+</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Add photos</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">How was it?</h3>
        <div className="flex items-center gap-4 justify-center">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              type="button"
              onClick={() => setMood(mood.label)}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center text-3xl
                transition-all duration-300 active:scale-90
                ${selectedMood === mood.label
                  ? "bg-blue-50 ring-4 ring-blue-100 scale-110 shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 grayscale hover:grayscale-0"
                }
              `}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-center text-sm text-gray-800 mt-4 font-bold bg-gray-50 w-max mx-auto px-4 py-1.5 rounded-full border border-gray-100">
            Feeling {selectedMood}
          </p>
        )}
      </div>
    </div>
  );
}
