import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function TodoJournalPage() {
  const [tasks, setTasks] = useState([
    { text: "Workout", done: false },
    { text: "Read 10 pages", done: true },
  ]);

  const completion =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.done).length / tasks.length) * 100
        );

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([...tasks, { text: "", done: false }]);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">

      {/* ===== DATE NAV ===== */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-zinc-800 rounded">
          <ChevronLeft />
        </button>

        <h1 className="text-2xl font-semibold">
          Tuesday, Feb 20
        </h1>

        <button className="p-2 hover:bg-zinc-800 rounded">
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* ===== TASK LIST ===== */}
        <div className="col-span-8 bg-zinc-800 rounded-xl p-6">

          <h2 className="text-lg mb-4">Today's Tasks</h2>

          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-zinc-900 p-3 rounded"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(i)}
                  className="w-5 h-5"
                />

                <input
                  type="text"
                  value={task.text}
                  placeholder="New task..."
                  className="bg-transparent outline-none w-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={addTask}
            className="mt-4 flex items-center gap-2 text-green-400"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* ===== PROGRESS PANEL ===== */}
        <div className="col-span-4 bg-zinc-800 rounded-xl p-6">

          <h2 className="text-lg mb-4">Progress</h2>

          <div className="text-4xl font-bold mb-4">
            {completion}%
          </div>

          <div className="mb-6 text-zinc-400">
            {tasks.length - tasks.filter(t => t.done).length} tasks left
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg">
            Save & Complete
          </button>
        </div>

      </div>
    </div>
  );
}