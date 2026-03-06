import { useState } from "react";

/**
 * Image 2: Coding Project Tracker
 */

const DEFAULT_PROJECT = {
    title: "Project Name",
    description: "Briefly describe your project here...",
    goals: [
        { id: "g-1", text: "Create user authentication", checked: true },
        { id: "g-2", text: "Build main dashboard page", checked: false },
        { id: "g-3", text: "Deploy to production", checked: false }
    ],
    features: [
        { id: "f-1", text: "Setup environment", priority: "High", status: "Done" },
        { id: "f-2", text: "Create database schema", priority: "High", status: "In Progress" },
        { id: "f-3", text: "Design UI mockups", priority: "Medium", status: "To Do" }
    ],
    bugs: [
        { id: "b-1", text: "Login page layout break on mobile", fixed: false }
    ]
};

const STATUS_COLORS = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Done": "bg-emerald-100 text-emerald-700"
};

const PRIORITY_COLORS = {
    "Low": "bg-emerald-50 text-emerald-600",
    "Medium": "bg-amber-50 text-amber-600",
    "High": "bg-rose-50 text-rose-600"
};

export default function CodingProjectTracker({ template, blocks, setBlocks }) {
    const mainBlock = blocks[0] || null;
    const project = mainBlock?.data?.project || DEFAULT_PROJECT;

    const saveProject = (newProject) => {
        if (!mainBlock) return;
        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, project: newProject } } : b));
    };

    const updateField = (field, value) => saveProject({ ...project, [field]: value });

    // Goals
    const addGoal = () => saveProject({ ...project, goals: [...project.goals, { id: `g-${Date.now()}`, text: "New Goal", checked: false }] });
    const removeGoal = (idx) => {
        const newGoals = [...project.goals];
        newGoals.splice(idx, 1);
        saveProject({ ...project, goals: newGoals });
    };
    const updateGoal = (idx, field, value) => {
        const newGoals = [...project.goals];
        newGoals[idx][field] = value;
        saveProject({ ...project, goals: newGoals });
    };

    // Features
    const addFeature = () => saveProject({ ...project, features: [...project.features, { id: `f-${Date.now()}`, text: "New Task", priority: "Medium", status: "To Do" }] });
    const removeFeature = (idx) => {
        const newFeats = [...project.features];
        newFeats.splice(idx, 1);
        saveProject({ ...project, features: newFeats });
    };
    const updateFeature = (idx, field, value) => {
        const newFeats = [...project.features];
        newFeats[idx][field] = value;
        saveProject({ ...project, features: newFeats });
    };

    // Bugs
    const addBug = () => saveProject({ ...project, bugs: [...project.bugs, { id: `b-${Date.now()}`, text: "New Bug", fixed: false }] });
    const removeBug = (idx) => {
        const newBugs = [...project.bugs];
        newBugs.splice(idx, 1);
        saveProject({ ...project, bugs: newBugs });
    };
    const updateBug = (idx, field, value) => {
        const newBugs = [...project.bugs];
        newBugs[idx][field] = value;
        saveProject({ ...project, bugs: newBugs });
    };

    const cycleStatus = (idx) => {
        const statuses = ["To Do", "In Progress", "Done"];
        const current = project.features[idx].status;
        const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
        updateFeature(idx, "status", next);
    };

    const cyclePriority = (idx) => {
        const priorities = ["Low", "Medium", "High"];
        const current = project.features[idx].priority;
        const next = priorities[(priorities.indexOf(current) + 1) % priorities.length];
        updateFeature(idx, "priority", next);
    };

    return (
        <div className="py-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Coding Project Tracker
            </h1>

            {/* Header / Meta */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>

                <input
                    value={project.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="text-2xl font-black text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full mb-2 relative z-10"
                    placeholder="Project Name"
                />
                <textarea
                    value={project.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="text-sm font-medium text-gray-500 bg-transparent border-none outline-none focus:ring-0 p-0 w-full resize-none relative z-10"
                    placeholder="Briefly describe your project here..."
                    rows={2}
                />
            </div>

            {/* Goals Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Key Goals</h2>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                        {project.goals.filter(g => g.checked).length}/{project.goals.length}
                    </span>
                </div>
                <div className="space-y-2">
                    {project.goals.map((goal, idx) => (
                        <div key={goal.id} className="flex flex-row items-center gap-3 p-2 hover:bg-gray-50 rounded-xl group relative">
                            <button
                                onClick={() => removeGoal(idx)}
                                className="absolute -left-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 w-5 h-5 flex items-center justify-center text-[10px]"
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => updateGoal(idx, "checked", !goal.checked)}
                                className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all border-2 ${goal.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300"
                                    }`}
                            >
                                {goal.checked && <span className="text-xs">✓</span>}
                            </button>
                            <input
                                value={goal.text}
                                onChange={(e) => updateGoal(idx, "text", e.target.value)}
                                className={`text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 ${goal.checked ? "line-through text-gray-400" : "text-gray-800"}`}
                            />
                        </div>
                    ))}
                    <button onClick={addGoal} className="text-xs font-bold text-gray-400 hover:text-gray-700 px-2 py-1">+ Add Goal</button>
                </div>
            </div>

            {/* Tasks / Features Board */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-4">Features & Tasks</h2>
                <div className="space-y-3">
                    {project.features.map((feat, idx) => (
                        <div key={feat.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all group relative">
                            <button
                                onClick={() => removeFeature(idx)}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 text-white bg-red-400 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm z-10"
                            >
                                ✕
                            </button>

                            <input
                                value={feat.text}
                                onChange={(e) => updateFeature(idx, "text", e.target.value)}
                                className={`text-sm font-bold bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 ${feat.status === "Done" ? "line-through text-gray-400" : "text-gray-800"}`}
                                placeholder="Task description..."
                            />

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => cyclePriority(idx)}
                                    className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg transition-colors ${PRIORITY_COLORS[feat.priority]}`}
                                >
                                    {feat.priority}
                                </button>
                                <button
                                    onClick={() => cycleStatus(idx)}
                                    className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg transition-colors min-w-[90px] text-center ${STATUS_COLORS[feat.status]}`}
                                >
                                    {feat.status}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addFeature} className="w-full text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl py-3 transition-colors">
                        + Add Task
                    </button>
                </div>
            </div>

            {/* Bug Tracker */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm bg-gradient-to-br from-rose-50/30 to-white">
                <h2 className="text-sm font-bold text-rose-900 tracking-wide uppercase mb-4 flex items-center gap-2">
                    <span>🐛</span> Known Bugs
                </h2>
                <div className="space-y-2">
                    {project.bugs.map((bug, idx) => (
                        <div key={bug.id} className="flex flex-row items-center gap-3 p-2 bg-white rounded-xl border border-rose-100/50 group relative">
                            <button
                                onClick={() => removeBug(idx)}
                                className="absolute -left-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 w-5 h-5 flex items-center justify-center text-[10px]"
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => updateBug(idx, "fixed", !bug.fixed)}
                                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all border-2 border-rose-200 hover:border-rose-400 ${bug.fixed ? "bg-emerald-500 border-none text-white text-xs" : ""
                                    }`}
                            >
                                {bug.fixed && "✓"}
                            </button>
                            <input
                                value={bug.text}
                                onChange={(e) => updateBug(idx, "text", e.target.value)}
                                className={`text-sm font-medium bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 ${bug.fixed ? "line-through text-gray-400" : "text-rose-900"}`}
                            />
                        </div>
                    ))}
                    <button onClick={addBug} className="text-xs font-bold text-rose-400 hover:text-rose-700 px-2 py-1">+ Add Bug</button>
                </div>
            </div>
        </div>
    );
}
