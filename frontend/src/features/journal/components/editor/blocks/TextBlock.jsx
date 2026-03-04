export default function TextBlock({ data, onChange }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm
                    focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100
                    transition-all duration-200">
      <textarea
        className="w-full p-4 text-gray-800 text-sm leading-relaxed
                   placeholder-gray-400 bg-transparent border-none
                   outline-none resize-y min-h-[80px]
                   focus:ring-0"
        value={data.text || ""}
        onChange={(e) =>
          onChange({ ...data, text: e.target.value })
        }
        placeholder="Write something…"
        rows={3}
      />
    </div>
  );
}