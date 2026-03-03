import DailyStats from "../models/daily.model.js";
import StreakEvent from "../models/streakevent.model.js";
import User from "../models/user.model.js";
import Page from "../models/page.model.js";
import Journal from "../models/book.model.js";

/**
 * Entry point for Coach
 */
export async function runCoach(userId, questionKey) {
  switch (questionKey) {
    case "RISK_TODAY":
      return await assessRisk(userId);

    case "WHY_STREAK_BROKE":
      return await explainStreakBreak(userId);

    case "WEEK_DAYS":
      return await findWeakDays(userId);

    case "WHAT_TO_ADJUST":
      return await suggestAdjustments(userId);

    case "SUMMARY":
      return await recentSummary(userId);

    case "TASK_INSIGHTS":
      return await taskInsights(userId);

    case "FULL_REPORT":
      return await fullReport(userId);

    default:
      throw new Error("Unsupported coach question");
  }
}

// ═══════════════════════════════════════════════════════
// AM I AT RISK TODAY?
// ═══════════════════════════════════════════════════════
async function assessRisk(userId) {
  const recent = await DailyStats.find({
    userId,
    excluded: false
  })
    .sort({ date: -1 })
    .limit(5);

  if (recent.length === 0) {
    return {
      level: "unknown",
      title: "Not enough data",
      message: "Use the app for a few days to see risk insights.",
      suggestion: "Start by creating a todo journal and completing tasks daily."
    };
  }

  const user = await User.findById(userId).select("streak").lean();
  const currentStreak = user?.streak?.current || 0;

  const failures = recent.filter(d => !d.success);
  const nearMisses = recent.filter(d => d.nearMiss);
  const avgCompletion = Math.round(
    recent.reduce((s, d) => s + d.completion, 0) / recent.length
  );

  // HIGH RISK
  if (failures.length >= 2) {
    return {
      level: "high",
      title: "⚠️ High risk of losing momentum",
      insight: `You missed ${failures.length} of the last ${recent.length} days.`,
      message: "Your completion rate has dropped significantly.",
      suggestion: "Start small — add just 2-3 tasks today and complete them all.",
      stats: {
        avgCompletion,
        failedDays: failures.length,
        currentStreak,
      }
    };
  }

  // MEDIUM RISK
  if (nearMisses.length >= 2) {
    return {
      level: "medium",
      title: "⚡ Consistency is fragile",
      insight: `You nearly missed ${nearMisses.length} recent days (60-69% completion).`,
      message: "You're on the edge — one more slip could break your streak.",
      suggestion: "Prioritize your top 3 tasks and finish them before noon.",
      stats: {
        avgCompletion,
        nearMissDays: nearMisses.length,
        currentStreak,
      }
    };
  }

  // LOW RISK
  return {
    level: "low",
    title: "✅ You're on track!",
    insight: `Average completion: ${avgCompletion}% over the last ${recent.length} days.`,
    message: "Momentum is strong. Keep it up!",
    suggestion: "Maintain your routine. Consider adding one stretch goal.",
    stats: {
      avgCompletion,
      currentStreak,
    }
  };
}

// ═══════════════════════════════════════════════════════
// WHY DID MY STREAK BREAK?
// ═══════════════════════════════════════════════════════
async function explainStreakBreak(userId) {
  const event = await StreakEvent.findOne({
    userId,
    eventType: "break"
  }).sort({ date: -1 });

  if (!event) {
    const user = await User.findById(userId).select("streak").lean();
    return {
      title: "🔥 Streak intact!",
      message: `Your current streak is ${user?.streak?.current || 0} days.`,
      suggestion: "Keep your daily goals realistic to maintain it.",
      currentStreak: user?.streak?.current || 0,
    };
  }

  // Find what they were trying to do on the day it broke
  const breakDate = event.date.toISOString().split("T")[0];
  const pages = await Page.find({
    date: breakDate,
  }).lean();

  let taskDetails = "";
  if (pages.length > 0) {
    for (const page of pages) {
      const blocks = page.contentJSON || [];
      for (const block of blocks) {
        if (block.type === "checklist") {
          const items = block.data?.items || [];
          const total = items.length;
          const done = items.filter(i =>
            typeof i === "object" ? i.checked : false
          ).length;
          taskDetails += `\n• ${done}/${total} tasks completed`;
        }
      }
    }
  }

  return {
    title: "💔 Your streak ended",
    date: event.date.toDateString(),
    insight: `Completion was only ${event.completion || 0}% that day.`,
    previousStreak: event.previousStreak || event.streakLength,
    taskDetails: taskDetails || "No task details available.",
    message: "A single off day broke the streak — it happens to everyone.",
    recovery: "Start a new streak today. Even 1 completed task counts.",
    suggestion: "Set fewer tasks on busy days to stay above 70%."
  };
}

// ═══════════════════════════════════════════════════════
// WHICH DAYS AM I WEAKEST?
// ═══════════════════════════════════════════════════════
async function findWeakDays(userId) {
  const stats = await DailyStats.find({
    userId,
    excluded: false
  });

  if (stats.length === 0) {
    return {
      title: "Not enough data",
      insight: "Start using the app daily to see patterns.",
      suggestion: "Track at least 7 days to unlock day-of-week insights."
    };
  }

  const dayMap = {};
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  stats.forEach(d => {
    const day = new Date(d.date).getDay();
    dayMap[day] = dayMap[day] || { total: 0, success: 0, totalCompletion: 0 };
    dayMap[day].total += 1;
    dayMap[day].totalCompletion += d.completion;
    if (d.success) dayMap[day].success += 1;
  });

  const dayStats = Object.entries(dayMap)
    .map(([day, v]) => ({
      day: Number(day),
      dayName: days[Number(day)],
      rate: Math.round((v.success / v.total) * 100),
      avgCompletion: Math.round(v.totalCompletion / v.total),
      total: v.total,
    }))
    .sort((a, b) => a.rate - b.rate);

  const weakest = dayStats[0];
  const strongest = dayStats[dayStats.length - 1];

  return {
    title: `📊 ${weakest.dayName} is your toughest day`,
    weakestDay: weakest.dayName,
    weakestRate: weakest.rate,
    weakestAvgCompletion: weakest.avgCompletion,
    strongestDay: strongest.dayName,
    strongestRate: strongest.rate,
    allDays: dayStats,
    insight: weakest.rate === 0
      ? `You haven't completed any tasks on ${weakest.dayName} yet.`
      : `Your success rate on ${weakest.dayName} is ${weakest.rate}% vs ${strongest.rate}% on ${strongest.dayName}.`,
    suggestion: `Schedule lighter tasks on ${weakest.dayName} or set reminders.`
  };
}

// ═══════════════════════════════════════════════════════
// WHAT SHOULD I ADJUST?
// ═══════════════════════════════════════════════════════
async function suggestAdjustments(userId) {
  const recent = await DailyStats.find({
    userId,
    excluded: false
  })
    .sort({ date: -1 })
    .limit(7);

  if (recent.length === 0) {
    return {
      level: "unknown",
      message: "Not enough data to suggest adjustments yet.",
      suggestion: "Use for at least 3 days to get personalized advice."
    };
  }

  const avgCompletion = Math.round(
    recent.reduce((sum, d) => sum + d.completion, 0) / recent.length
  );

  // Get task counts from recent pages to understand workload
  const user = await User.findById(userId).select("streak").lean();
  const currentStreak = user?.streak?.current || 0;

  // OVERLOADED
  if (avgCompletion < 50) {
    return {
      level: "overloaded",
      title: "🔴 You're overloaded",
      insight: `You completed only ${avgCompletion}% of tasks in the last 7 days.`,
      message: "Your daily plans are too ambitious for your current capacity.",
      suggestion: "Cut your daily task list in half. Focus on 3 essential tasks max.",
      stats: { avgCompletion, currentStreak, daysTracked: recent.length }
    };
  }

  // STRAINED
  if (avgCompletion < 70) {
    return {
      level: "strained",
      title: "🟡 Workload needs tuning",
      insight: `Average completion: ${avgCompletion}% over ${recent.length} days.`,
      message: "You're close to the threshold but struggling to hit 70%.",
      suggestion: "Remove 1-2 low-priority tasks daily. Focus on Must-Do items.",
      stats: { avgCompletion, currentStreak, daysTracked: recent.length }
    };
  }

  // BALANCED
  if (avgCompletion <= 90) {
    return {
      level: "balanced",
      title: "🟢 Well balanced",
      insight: `Avg completion: ${avgCompletion}% — this is the sweet spot.`,
      message: "Your planning matches your capacity well.",
      suggestion: "Maintain this pace. You can try adding one stretch goal.",
      stats: { avgCompletion, currentStreak, daysTracked: recent.length }
    };
  }

  // UNDERLOADED
  return {
    level: "underloaded",
    title: "🔵 Room to grow",
    insight: `You're completing ${avgCompletion}% — almost everything!`,
    message: "Your tasks may be too easy. You might be playing it safe.",
    suggestion: "Add one challenging task to push yourself. Growth comes from stretch.",
    stats: { avgCompletion, currentStreak, daysTracked: recent.length }
  };
}

// ═══════════════════════════════════════════════════════
// WEEKLY SUMMARY
// ═══════════════════════════════════════════════════════
async function recentSummary(userId) {
  const stats = await DailyStats.find({
    userId,
    excluded: false
  })
    .sort({ date: -1 })
    .limit(7);

  if (stats.length === 0) {
    return {
      title: "No recent data",
      message: "Start tracking daily to see your weekly summary.",
      suggestion: "Create a todo or planner journal and use it every day."
    };
  }

  const avg = Math.round(
    stats.reduce((s, d) => s + d.completion, 0) / stats.length
  );

  const goodDays = stats.filter(d => d.completion >= 70).length;
  const lowDays = stats.filter(d => d.completion < 50).length;
  const perfectDays = stats.filter(d => d.completion === 100).length;

  // Trend detection (compare first half vs second half)
  const firstHalf = stats.slice(Math.floor(stats.length / 2));
  const secondHalf = stats.slice(0, Math.floor(stats.length / 2));

  const avgFirst = firstHalf.reduce((s, d) => s + d.completion, 0) / (firstHalf.length || 1);
  const avgSecond = secondHalf.reduce((s, d) => s + d.completion, 0) / (secondHalf.length || 1);

  let trend = "stable";
  let trendEmoji = "➡️";
  if (avgSecond > avgFirst + 5) { trend = "improving"; trendEmoji = "📈"; }
  else if (avgSecond < avgFirst - 5) { trend = "declining"; trendEmoji = "📉"; }

  const user = await User.findById(userId).select("streak").lean();

  return {
    title: `${trendEmoji} Your Weekly Summary`,
    averageCompletion: avg,
    daysTracked: stats.length,
    goodDays,
    lowDays,
    perfectDays,
    trend,
    currentStreak: user?.streak?.current || 0,
    bestStreak: user?.streak?.best || 0,
    insight: trend === "improving"
      ? `📈 Performance is improving! Up from ${Math.round(avgFirst)}% to ${Math.round(avgSecond)}%.`
      : trend === "declining"
        ? `📉 Performance dropped from ${Math.round(avgFirst)}% to ${Math.round(avgSecond)}%.`
        : `➡️ Performance has been consistent at ~${avg}%.`,
    suggestion: avg < 60
      ? "Reduce your daily task count. Quality over quantity."
      : avg >= 90
        ? "Challenge yourself with harder tasks."
        : "You're in a great rhythm. Keep going!"
  };
}

// ═══════════════════════════════════════════════════════
// TASK-LEVEL INSIGHTS (NEW)
// Deep analysis of actual checklist data from pages
// ═══════════════════════════════════════════════════════
async function taskInsights(userId) {
  // Get recent journals
  const journals = await Journal.find({
    userId,
    isArchived: false,
    journalType: { $in: ["todo", "planner"] },
  })
    .select("_id title journalType")
    .lean();

  if (journals.length === 0) {
    return {
      title: "No trackable journals",
      message: "Create a todo or planner journal to get task insights.",
    };
  }

  const journalIds = journals.map(j => j._id);

  // Get last 7 pages from trackable journals
  const recentPages = await Page.find({
    journalId: { $in: journalIds },
  })
    .sort({ date: -1 })
    .limit(7)
    .lean();

  if (recentPages.length === 0) {
    return {
      title: "No pages yet",
      message: "Start writing in your journals to unlock task insights.",
    };
  }

  // Analyze tasks across pages
  let totalTasks = 0;
  let completedTasks = 0;
  let avgTasksPerDay = 0;
  const tasksByDay = {};

  for (const page of recentPages) {
    const blocks = page.contentJSON || [];
    let pageTotal = 0;
    let pageDone = 0;

    for (const block of blocks) {
      if (block.type === "checklist") {
        const items = block.data?.items || [];
        for (const item of items) {
          if (typeof item === "object" && item.text?.trim()) {
            pageTotal++;
            totalTasks++;
            if (item.checked) {
              pageDone++;
              completedTasks++;
            }
          }
        }
      }
    }

    const dayName = new Date(page.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
    tasksByDay[dayName] = { total: pageTotal, done: pageDone };
  }

  avgTasksPerDay = Math.round(totalTasks / recentPages.length);
  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  let workloadAdvice = "";
  if (avgTasksPerDay > 10) {
    workloadAdvice = "You're adding too many tasks. Limit to 5-7 per day for better focus.";
  } else if (avgTasksPerDay < 3) {
    workloadAdvice = "Try adding more tasks to build a stronger daily routine.";
  } else {
    workloadAdvice = "Your task count is well-balanced.";
  }

  return {
    title: "📋 Task Analysis",
    totalTasks,
    completedTasks,
    completionRate,
    avgTasksPerDay,
    daysAnalyzed: recentPages.length,
    tasksByDay,
    workloadAdvice,
    insight: completionRate >= 80
      ? `Great execution! You completed ${completionRate}% of ${totalTasks} tasks.`
      : completionRate >= 60
        ? `Decent progress at ${completionRate}%, but there's room to improve.`
        : `Only ${completionRate}% completion. Consider reducing task count.`,
    suggestion: workloadAdvice,
  };
}

// ═══════════════════════════════════════════════════════
// FULL REPORT (NEW)
// Comprehensive report combining all insights
// ═══════════════════════════════════════════════════════
async function fullReport(userId) {
  const [risk, summary, tasks, adjustments] = await Promise.all([
    assessRisk(userId),
    recentSummary(userId),
    taskInsights(userId),
    suggestAdjustments(userId),
  ]);

  return {
    title: "📊 Full Consistency Report",
    risk,
    summary,
    tasks,
    adjustments,
    generatedAt: new Date().toISOString(),
  };
}
