export default function TextBlock({ data, onChange }) {
  return (
    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 overflow-hidden">
      <textarea
        className="w-full p-4 text-zinc-200 text-sm leading-relaxed
                   placeholder-zinc-500 bg-transparent border-none
                   outline-none resize-y min-h-[60px]
                   focus:ring-0"
        value={data.text || ""}
        onChange={(e) =>
          onChange({ ...data, text: e.target.value })
        }
        placeholder="Write something…"
        rows={2}
      />
    </div>
  );
}