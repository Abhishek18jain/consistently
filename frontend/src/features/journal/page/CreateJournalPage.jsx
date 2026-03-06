import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { journalApi } from "../api/journalApi";

export default function CreateJournalPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [journalType, setJournalType] =
    useState("planner");

  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();

    if (!journalType) return;

    setLoading(true);

    try {
      const res = await journalApi.createJournal({
        title,
        journalType,
      });

      const journal = res.data.journal;

      /* ⭐ IMPORTANT — go to resolver */
      navigate(`/journals/${journal._id}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-6">
          Create New Journal
        </h1>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block mb-1 text-sm font-medium text-zinc-300">
              Journal Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="My Journal"
              className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100
                         p-3 rounded-xl outline-none focus:border-blue-500
                         placeholder-zinc-500 transition-colors"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block mb-1 text-sm font-medium text-zinc-300">
              Journal Type
            </label>

            <select
              value={journalType}
              onChange={(e) =>
                setJournalType(e.target.value)
              }
              className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100
                         p-3 rounded-xl outline-none focus:border-blue-500
                         transition-colors"
            >
              <option value="planner">Planner</option>
              <option value="todo">Todo</option>
              <option value="study">Study</option>
              <option value="reflection">
                Reflection
              </option>
              <option value="fitness">Fitness</option>
              <option value="coder">Coder</option>
              <option value="blank">Blank</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl
                       font-medium transition-colors disabled:opacity-50 active:scale-95"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}