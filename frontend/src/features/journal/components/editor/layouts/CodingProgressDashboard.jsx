import { useState } from "react";
import dayjs from "dayjs";

/**
 * Image 5: Coding Progress Dashboard
 */

const DEFAULT_DATA = {
    title: "Coding Progress Dashboard",
    streak: {
        count: 7,
        totalSolved: 29,
        days: [
            { id: "d-1", checked: true },
            { id: "d-2", checked: true },
            { id: "d-3", checked: true },
            { id: "d-4", checked: true },
            { id: "d-5", checked: true },
            { id: "d-6", checked: false },
            { id: "d-7", checked: false },
        ]
    },
    weeklyStats: {
        totalWeek: 29,
        chartData: [
            { id: "w-1", date: "Apr 1", value: 6 },
            { id: "w-2", date: "Apr 8", value: 10 },
            { id: "w-3", date: "Apr 15", value: 15 },
            { id: "w-4", date: "Apr 22", value: 7 },
            { id: "w-5", date: "Apr 29", value: 3 },
        ],
        pieChart: {
            easy: 79,
            medium: 68,
            hard: 39,
            easyPercent: 42,
            mediumPercent: 37,
            hardPercent: 21,
            total: 186
        }
    },
    topics: [
        { id: "t-1", name: "Arrays", count: 45, color: "emerald" },
        { id: "t-2", name: "Binary Search", count: 32, color: "amber" },
        { id: "t-3", name: "Dynamic Programming", count: 28, color: "blue" },
    ],
    recentProblems: [
        { id: "rp-1", title: "Two Sum", difficulty: "Easy", date: "2 days ago", checked: false },
        { id: "rp-2", title: "Binary Tree Level Order Traversal", difficulty: "Medium", date: "Apr 19, 2024", checked: false },
        { id: "rp-3", title: "Longest Increasing Subsequence", difficulty: "Medium", date: "Apr 17, 2024", checked: false },
        { id: "rp-4", title: "Binary Search", difficulty: "Medium", date: "Apr 15, 2024", checked: false },
    ]
};

const DIFF_COLORS = {
    "Easy": "bg-emerald-100 text-emerald-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Hard": "bg-rose-100 text-rose-700"
};

const TOPIC_COLORS = {
    "emerald": "bg-emerald-500",
    "amber": "bg-amber-400",
    "blue": "bg-blue-400",
    "purple": "bg-purple-500",
    "rose": "bg-rose-400",
}

export default function CodingProgressDashboard({ template, blocks, setBlocks }) {
    const mainBlock = blocks[0] || null;
    const data = mainBlock?.data?.dashboard || DEFAULT_DATA;

    const saveData = (newData) => {
        if (!mainBlock) return;
        setBlocks(prev => prev.map(b => b.id === mainBlock.id ? { ...b, data: { ...b.data, dashboard: newData } } : b));
    };

    const updateField = (field, value) => saveData({ ...data, [field]: value });
    const updateStreak = (field, value) => saveData({ ...data, streak: { ...data.streak, [field]: value } });

    // Streak Days
    const toggleStreakDay = (idx) => {
        const newDays = [...data.streak.days];
        newDays[idx].checked = !newDays[idx].checked;
        saveData({ ...data, streak: { ...data.streak, days: newDays } });
    };

    // Weekly Chart
    const addChartBar = () => {
        const newChart = [...data.weeklyStats.chartData, { id: `w-${Date.now()}`, date: "New", value: 5 }];
        saveData({ ...data, weeklyStats: { ...data.weeklyStats, chartData: newChart } });
    };
    const updateChartBar = (idx, field, value) => {
        const newChart = [...data.weeklyStats.chartData];
        newChart[idx][field] = value;
        saveData({ ...data, weeklyStats: { ...data.weeklyStats, chartData: newChart } });
    };
    const removeChartBar = (idx) => {
        const newChart = [...data.weeklyStats.chartData];
        newChart.splice(idx, 1);
        saveData({ ...data, weeklyStats: { ...data.weeklyStats, chartData: newChart } });
    };

    // Advanced Pie Chart Update helper
    const updatePieField = (field, value) => {
        const newPie = { ...data.weeklyStats.pieChart, [field]: parseInt(value) || 0 };
        // simple auto calc
        const total = newPie.easy + newPie.medium + newPie.hard;
        if (total > 0 && field !== 'total') {
            newPie.total = total;
            newPie.easyPercent = Math.round((newPie.easy / total) * 100);
            newPie.mediumPercent = Math.round((newPie.medium / total) * 100);
            newPie.hardPercent = Math.round((newPie.hard / total) * 100);
        }
        saveData({ ...data, weeklyStats: { ...data.weeklyStats, pieChart: newPie } });
    }

    // Topics
    const addTopic = () => {
        const colors = Object.keys(TOPIC_COLORS);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        saveData({ ...data, topics: [...data.topics, { id: `t-${Date.now()}`, name: "New Topic", count: 0, color: randomColor }] })
    };
    const updateTopic = (idx, field, value) => {
        const newTopics = [...data.topics];
        newTopics[idx][field] = value;
        saveData({ ...data, topics: newTopics });
    };
    const removeTopic = (idx) => {
        const newTopics = [...data.topics];
        newTopics.splice(idx, 1);
        saveData({ ...data, topics: newTopics });
    };

    // Recent Problems
    const addProblem = () => saveData({ ...data, recentProblems: [...data.recentProblems, { id: `rp-${Date.now()}`, title: "New Problem", difficulty: "Medium", date: dayjs().format("MMM D, YYYY"), checked: false }] });
    const removeProblem = (idx) => {
        const newProbs = [...data.recentProblems];
        newProbs.splice(idx, 1);
        saveData({ ...data, recentProblems: newProbs });
    };
    const updateProblem = (idx, field, value) => {
        const newProbs = [...data.recentProblems];
        newProbs[idx][field] = value;
        saveData({ ...data, recentProblems: newProbs });
    };
    const cycleDifficulty = (idx) => {
        const diffs = ["Easy", "Medium", "Hard"];
        const current = data.recentProblems[idx].difficulty;
        const next = diffs[(diffs.indexOf(current) + 1) % diffs.length];
        updateProblem(idx, "difficulty", next);
    };

    const maxChartVal = Math.max(...data.weeklyStats.chartData.map(c => c.value), 20);

    return (
        <div className="py-4 space-y-6 bg-slate-50/30 p-4 rounded-3xl">
            <input
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="text-2xl font-bold text-slate-800 text-center bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Dashboard Title"
            />

            {/* Streak Panel */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl p-6 border border-indigo-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">Weekly Streak</h3>
                    <div className="flex items-end gap-2 mb-3">
                        <input
                            type="number"
                            value={data.streak.count}
                            onChange={(e) => updateStreak("count", parseInt(e.target.value) || 0)}
                            className="text-2xl font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 w-10 text-center -ml-1"
                        />
                        <span className="text-xl font-bold text-slate-800 mb-0.5">-Day Streak!</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.streak.days.map((day, idx) => (
                            <button
                                key={day.id}
                                onClick={() => toggleStreakDay(idx)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${day.checked ? "bg-blue-500 text-white shadow-sm" : "bg-blue-100 text-transparent"
                                    }`}
                            >
                                ✓
                            </button>
                        ))}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-2 text-center mr-1">Keep it up!</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-50 flex flex-col items-center justify-center min-w-[100px]">
                    <input
                        type="number"
                        value={data.streak.totalSolved}
                        onChange={(e) => updateStreak("totalSolved", parseInt(e.target.value) || 0)}
                        className="text-3xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 w-16 text-center"
                    />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Solved</span>
                </div>
            </div>

            {/* Middle Section: Bar Chart & Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-800">Problems Solved Per Week</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">Total Week:</span>
                        <input
                            type="number"
                            value={data.weeklyStats.totalWeek}
                            onChange={(e) => saveData({ ...data, weeklyStats: { ...data.weeklyStats, totalWeek: parseInt(e.target.value) || 0 } })}
                            className="bg-transparent text-sm font-bold text-slate-800 text-right w-10 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                    {/* Bar Chart */}
                    <div className="flex-1 flex items-end justify-between h-40 gap-2 w-full">
                        {data.weeklyStats.chartData.map((bar, idx) => {
                            const heightPct = Math.round((bar.value / maxChartVal) * 100);
                            return (
                                <div key={bar.id} className="flex flex-col items-center gap-2 flex-1 relative group">
                                    <button onClick={() => removeChartBar(idx)} className="absolute -top-6 opacity-0 group-hover:opacity-100 text-red-400 text-[10px] w-full text-center hover:text-red-500">✕</button>
                                    <input
                                        type="number"
                                        value={bar.value}
                                        onChange={(e) => updateChartBar(idx, "value", parseInt(e.target.value) || 0)}
                                        className="text-xs font-bold text-slate-400 w-full text-center bg-transparent outline-none p-0 border-none"
                                    />
                                    <div className="w-full flex justify-center items-end flex-1">
                                        <div
                                            className="w-10 rounded-t-lg bg-gradient-to-b from-emerald-400/80 to-emerald-200/50 transition-all"
                                            style={{ height: `${heightPct}%`, minHeight: '10%' }}
                                        ></div>
                                    </div>
                                    <input
                                        value={bar.date}
                                        onChange={(e) => updateChartBar(idx, "date", e.target.value)}
                                        className="text-[10px] font-semibold text-slate-500 w-full text-center bg-transparent outline-none p-0 border-none truncate"
                                    />
                                </div>
                            );
                        })}
                        <button onClick={addChartBar} className="h-full px-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg text-lg font-bold transition-all">+</button>
                    </div>

                    {/* Donut Chart Simulation */}
                    <div className="w-48 h-48 flex flex-col items-center justify-center shrink-0">
                        {/* CSS-based simplified donut logic for aesthetic purpose without external libs */}
                        <div className="relative w-36 h-36 rounded-full border-[16px] border-emerald-400 flex items-center justify-center">
                            <div className="absolute inset-[-16px] border-[16px] border-amber-400 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transform: 'rotate(-45deg)' }}></div>
                            <div className="absolute inset-[-16px] border-[16px] border-rose-400 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)', transform: 'rotate(20deg)' }}></div>

                            {/* Center circle */}
                            <div className="bg-white rounded-full w-24 h-24 absolute flex items-center justify-center shadow-inner z-10">
                                <input
                                    type="number"
                                    value={data.weeklyStats.pieChart.total}
                                    onChange={(e) => updatePieField("total", e.target.value)}
                                    className="text-3xl font-black text-slate-800 bg-transparent text-center w-full outline-none p-0 border-none pl-2"
                                />
                            </div>

                            {/* Labels on Donut */}
                            <span className="absolute top-2 left-2 text-[10px] font-bold text-white z-20 mix-blend-difference">{data.weeklyStats.pieChart.easyPercent}%</span>
                            <span className="absolute bottom-4 left-2 text-[10px] font-bold text-amber-700 z-20 text-shadow-sm">{data.weeklyStats.pieChart.mediumPercent}%</span>
                            <span className="absolute bottom-6 right-2 text-[10px] font-bold text-rose-900 z-20">{data.weeklyStats.pieChart.hardPercent}%</span>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <input type="number" value={data.weeklyStats.pieChart.easy} onChange={(e) => updatePieField("easy", e.target.value)} className="w-6 text-[10px] font-bold bg-transparent border-none p-0 outline-none text-emerald-900" />
                                <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">Easy</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                <input type="number" value={data.weeklyStats.pieChart.medium} onChange={(e) => updatePieField("medium", e.target.value)} className="w-6 text-[10px] font-bold bg-transparent border-none p-0 outline-none text-amber-900" />
                                <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">Medium</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                <input type="number" value={data.weeklyStats.pieChart.hard} onChange={(e) => updatePieField("hard", e.target.value)} className="w-6 text-[10px] font-bold bg-transparent border-none p-0 outline-none text-rose-900" />
                                <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">Hard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Difficulty Distribution Detail */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">📊</span>
                        Difficulty Distribution
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: "Easy", color: "emerald", pct: data.weeklyStats.pieChart.easyPercent },
                            { name: "Medium", color: "amber", pct: data.weeklyStats.pieChart.mediumPercent },
                            { name: "Hard", color: "rose", pct: data.weeklyStats.pieChart.hardPercent },
                        ].map(d => (
                            <div key={d.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${d.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' :
                                            d.color === 'amber' ? 'bg-amber-100 border-amber-400' : 'border-rose-300'
                                        }`}>
                                        <span className={`text-[10px] ${d.color === 'emerald' ? 'text-emerald-500' :
                                                d.color === 'amber' ? 'text-amber-500' : 'text-transparent'
                                            }`}>✓</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{d.name}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${d.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                        d.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                    }`}>{d.pct}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topics Mastered */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]">🗂️</span>
                            Topics Mastered
                        </h3>
                        <span className="font-bold text-slate-800">{data.topics.length}</span>
                    </div>
                    <div className="space-y-3">
                        {data.topics.map((t, idx) => (
                            <div key={t.id} className="flex items-center justify-between group relative">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className={`w-3 h-3 rounded-sm ${TOPIC_COLORS[t.color] || "bg-emerald-500"}`}></span>
                                    <input
                                        value={t.name}
                                        onChange={(e) => updateTopic(idx, "name", e.target.value)}
                                        className="text-sm font-semibold text-slate-700 bg-transparent outline-none border-none p-0 flex-1 min-w-0 md:max-w-[150px]"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={t.count}
                                        onChange={(e) => updateTopic(idx, "count", parseInt(e.target.value) || 0)}
                                        className="text-sm font-semibold text-slate-800 bg-transparent outline-none border-none p-0 w-8 text-right"
                                    />
                                    <button onClick={() => removeTopic(idx)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs w-4">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addTopic} className="text-xs font-bold text-blue-500 hover:bg-blue-50 px-2 py-1 rounded w-full mt-2 text-left">+ Add Topic</button>
                </div>
            </div>

            {/* Recent Problems */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Problems</h3>
                <div className="space-y-3">
                    {data.recentProblems.map((prob, idx) => (
                        <div key={prob.id} className="flex items-center justify-between group relative hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                                <button
                                    onClick={() => updateProblem(idx, "checked", !prob.checked)}
                                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${prob.checked ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300"
                                        }`}
                                >
                                    {prob.checked && <span className="text-[10px]">✓</span>}
                                </button>
                                <input
                                    value={prob.title}
                                    onChange={(e) => updateProblem(idx, "title", e.target.value)}
                                    className={`text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 ${prob.checked ? "text-slate-400 line-through" : "text-slate-700"
                                        }`}
                                />
                            </div>
                            <div className="flex items-center gap-4 shrink-0 justify-end w-[180px]">
                                <button
                                    onClick={() => cycleDifficulty(idx)}
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md min-w-[65px] text-center ${DIFF_COLORS[prob.difficulty]}`}
                                >
                                    {prob.difficulty}
                                </button>
                                <input
                                    value={prob.date}
                                    onChange={(e) => updateProblem(idx, "date", e.target.value)}
                                    className="text-xs text-slate-400 font-medium bg-transparent border-none outline-none focus:ring-0 p-0 text-right w-[80px]"
                                />
                                <button onClick={() => removeProblem(idx)} className="opacity-0 group-hover:opacity-100 absolute -left-5 text-red-500 hover:text-red-700 text-[10px] w-4 leading-4 flex items-center justify-center">✕</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addProblem} className="text-xs font-bold text-blue-500 hover:bg-blue-50 px-2 py-1 rounded w-full mt-2 text-left">+ Add Problem</button>
                </div>
            </div>

        </div>
    );
}
