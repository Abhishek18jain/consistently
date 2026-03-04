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

    setJournal(journal);

    if (chooseNow) {
      navigate(`/templates/${journal._id}`);
    } else {
      navigate(`/journals`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                    flex items-center justify-center p-4
                    animate-[fadeIn_200ms_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6
                      border border-gray-200
                      animate-[slideUp_300ms_ease-out]">

        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Create {presetType} Journal
        </h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Journal name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl
                     text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all mb-5"
        />

        {/* Template Choice */}
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="radio"
              name="templateChoice"
              checked={!chooseNow}
              onChange={() => setChooseNow(false)}
              className="accent-blue-600"
            />
            Choose later
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="radio"
              name="templateChoice"
              checked={chooseNow}
              onChange={() => setChooseNow(true)}
              className="accent-blue-600"
            />
            Choose now
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700
                       rounded-xl text-sm font-medium transition-all duration-200"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white
                       rounded-xl text-sm font-medium transition-all duration-200
                       disabled:opacity-50 active:scale-95"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}