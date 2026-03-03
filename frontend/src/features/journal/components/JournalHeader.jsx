export default function JournalHeader({ title }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
      <h1 className="text-lg font-semibold text-white">
        {title || "Journal"}
      </h1>
    </div>
  );
}