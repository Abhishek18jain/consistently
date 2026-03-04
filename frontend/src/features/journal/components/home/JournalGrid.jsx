import { useState } from "react";
import JournalCard from "./JournalCard";

export default function JournalGrid({ journals: initialJournals }) {
  const [journals, setJournals] = useState(initialJournals);

  const handleDelete = (id) => {
    setJournals(prev => prev.filter(j => j._id !== id));
  };

  if (!journals.length) {
    return (
      <div className="text-center py-16 border border-gray-200 rounded-2xl bg-white shadow-sm">
        <div className="text-4xl mb-3">📓</div>
        <p className="text-gray-500 text-lg font-medium">No journals yet</p>
        <p className="text-gray-400 text-sm mt-1">Create one from the presets above</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Your Journals</h2>
        <span className="text-sm text-gray-400 font-medium">{journals.length} total</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {journals.map((journal) => (
          <JournalCard key={journal._id} journal={journal} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
}