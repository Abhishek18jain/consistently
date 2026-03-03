export default function EmptyJournalState({
  onCreate,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
      <h2 className="text-xl mb-4">
        No journals yet
      </h2>

      <button
        onClick={onCreate}
        className="px-6 py-3 bg-indigo-600 rounded text-white"
      >
        Create Journal
      </button>
    </div>
  );
}