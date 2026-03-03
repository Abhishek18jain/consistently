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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Create New Journal
      </h1>

      <form onSubmit={handleCreate}>
        {/* TITLE */}
        <div className="mb-4">
          <label className="block mb-1">
            Journal Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="My Journal"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* TYPE */}
        <div className="mb-6">
          <label className="block mb-1">
            Journal Type
          </label>

          <select
            value={journalType}
            onChange={(e) =>
              setJournalType(e.target.value)
            }
            className="w-full border p-2 rounded"
          >
            <option value="planner">Planner</option>
            <option value="todo">Todo</option>
            <option value="study">Study</option>
            <option value="reflection">
              Reflection
            </option>
            <option value="fitness">Fitness</option>
            <option value="blank">Blank</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}