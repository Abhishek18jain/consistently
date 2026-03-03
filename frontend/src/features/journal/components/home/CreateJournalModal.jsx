// features/journal/components/home/CreateJournalModal.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateJournal from "../../hooks/useCreateJournal";
import useJournalStore from "../../store/journal.store";

export default function CreateJournalModal({
  isOpen,
  presetType,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [chooseNow, setChooseNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createJournal } = useCreateJournal();
  const setJournal = useJournalStore((s) => s.setJournal);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    console.log("Create clicked");

    if (!title.trim()) {
      alert("Enter a journal name");
      return;
    }

    setLoading(true);

    const journal = await createJournal({
      title,
      journalType: presetType,
    });

    setLoading(false);

    if (!journal) {
      alert("Journal creation failed. Check console.");
      return;
    }

    console.log("Created journal:", journal);

    setJournal(journal);

    // Navigate correctly
  if (chooseNow) {
    console.log("Navigating with ID:", journal._id);
  navigate(`/templates/${journal._id}`);
} else {
  navigate(`/journals`);
}

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-[420px]">
        <h2 className="text-xl font-semibold mb-4">
          Create {presetType} Journal
        </h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Journal name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 p-3 rounded mb-4"
        />

        {/* Template Choice */}
        <div className="flex items-center gap-3 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="templateChoice"
              checked={!chooseNow}
              onChange={() => setChooseNow(false)}
            />
            Choose later
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="templateChoice"
              checked={chooseNow}
              onChange={() => setChooseNow(true)}
            />
            Choose now
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}