import DailyStats from "../models/daily.model.js";
import StreakEvent from "../models/streakevent.model.js";
import User from "../models/user.model.js";

/**
 * Entry point for Coach
 */
export async function runCoach(userId, questionKey) {
  switch (questionKey) {
    case "RISK_TODAY":
      return await assessRisk(userId);

    case "WHY_STREAK_BROKE":
      return await explainStreakBreak(userId);

    case "WEAK_DAYS":
      return await findWeakDays(userId);

    case "WHAT_TO_ADJUST":
      return await suggestAdjustments(userId);

    case "SUMMARY":
      return await recentSummary(userId);

    default:
      throw new Error("Unsupported coach question");
  }
}
// AM I AT RISK TODAY 
async function assessRisk(userId) {
  const recent = await DailyStats.find({
    userId,
    excluded: false
  })
    .sort({ date: -1 })
    .limit(5);

  if (recent.length === 0) {
    return {
      Risklevel: "Not enough data",
      title: "Not enough data",
      message: "Use the app for a few days to see risk insights."
    };
  }

  const failures = recent.filter(d => !d.success);
  const nearMisses = recent.filter(d => d.nearMiss);

  // HIGH RISK
  if (failures.length >= 2) {
    return {
      Risklevel: "high",
      title: "High risk of a bad day",
      insight: `You missed ${failures.length} of the last ${recent.length} days.`,
      message: "Momentum is slipping.",
      suggestion:
        "Start with one small, easy task today to rebuild consistency."
    };
  }

  // MEDIUM RISK
  if (nearMisses.length >= 2) {
    return {
      Risklevel: "medium",
      title: "Consistency is fragile",
      insight: `You nearly missed ${nearMisses.length} recent days.`,
      message: "You're close to losing momentum.",
      suggestion:
        "Keep today’s plan light and finish tasks early."
    };
  }

  // LOW RISK
  return {
    level: "low",
    title: "You're on track",
    insight: "Recent days show stable progress.",
    message: "Momentum is strong.",
    suggestion: "Maintain your routine."
  };
}

// STREAK BREAK 
async function explainStreakBreak(userId) {
  const event = await StreakEvent.findOne({
    userId,
    eventType: "break"
  }).sort({ date: -1 });

  if (!event) {
    return {
      title: "Streak intact",
      message: "Your streak is still active.",
      suggestion: "Keep your daily goals realistic to maintain it."
    };
  }

  const reasonMap = {
    missed_day: "You missed the day entirely.",
    low_completion: "You completed too few planned tasks.",
    manual_reset: "The streak was reset manually."
  };

  const readableReason =
    reasonMap[event.reason] || "Consistency dropped that day.";

  return {
    title: "Your streak ended",
    date: event.date.toDateString(),
    insight: readableReason,
    completion: `${event.completion}% completed`,
    message:
      "A single off day broke the streak — it happens to everyone.",
    recovery:
      "Start a new streak today with fewer tasks and rebuild momentum."
  };
}

// WEEK DAYS 
async function findWeakDays(userId) {
  const stats = await DailyStats.find({
    userId,
    excluded: false
  });

  if (stats.length === 0) {
    return {
      title: "Not enough data",
      insight: "Start using the app daily to see patterns."
    };
  }

  const dayMap = {};

  stats.forEach(d => {
    const day = new Date(d.date).getDay();
    dayMap[day] = dayMap[day] || { total: 0, success: 0 };
    dayMap[day].total += 1;
    if (d.success) dayMap[day].success += 1;
  });

  const weakest = Object.entries(dayMap)
    .map(([day, v]) => ({
      day: Number(day),
      rate: Math.round((v.success / v.total) * 100)
    }))
    .sort((a, b) => a.rate - b.rate)[0];

  const days = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday"
  ];

  return {
    title: `${days[weakest.day]} is your toughest day`,
    day: days[weakest.day],
    successRate: weakest.rate,
    insight:
      weakest.rate === 0
        ? "You haven't completed any tasks on this day yet."
        : "Your success rate is lower on this day compared to others.",
    suggestion:
      "Consider scheduling lighter tasks or adding reminders."
  };
}
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
      message: "Not enough data to suggest adjustments yet."
    };
  }

  const avgCompletion =
    recent.reduce((sum, d) => sum + d.completion, 0) /
    recent.length;

  // OVERLOADED
  if (avgCompletion < 50) {
    return {
      level: "overloaded",
      insight: `You completed only ${Math.round(avgCompletion)}% of tasks in the last 7 days.`,
      message: "Your daily plans are too ambitious.",
      suggestion:
        "Reduce your daily tasks by about 30% and focus on essentials."
    };
  }

  // SLIGHTLY OVERLOADED
  if (avgCompletion < 70) {
    return {
      level: "strained",
      insight: `You completed ${Math.round(avgCompletion)}% recently.`,
      message: "Your workload may be slightly heavy.",
      suggestion:
        "Trim a few low-priority tasks to improve consistency."
    };
  }

  // BALANCED
  if (avgCompletion <= 90) {
    return {
      level: "balanced",
      insight: `You completed ${Math.round(avgCompletion)}% of tasks.`,
      message: "Your planning looks realistic.",
      suggestion: "Maintain your current approach."
    };
  }

  // UNDERLOADED
  return {
    level: "underloaded",
    insight: `You completed ${Math.round(avgCompletion)}% consistently.`,
    message: "Your tasks may be too easy.",
    suggestion:
      "Consider adding one challenging task to grow further."
  };
}
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
      message: "Start tracking daily to see your weekly summary."
    };
  }

  const avg = Math.round(
    stats.reduce((s, d) => s + d.completion, 0) / stats.length
  );

  const goodDays = stats.filter(d => d.completion >= 70).length;
  const lowDays = stats.filter(d => d.completion < 50).length;

  // Trend detection (compare first half vs second half)
  const firstHalf = stats.slice(3);
  const secondHalf = stats.slice(0, 3);

  const avgFirst =
    firstHalf.reduce((s, d) => s + d.completion, 0) /
    (firstHalf.length || 1);

  const avgSecond =
    secondHalf.reduce((s, d) => s + d.completion, 0) /
    (secondHalf.length || 1);

  let trend = "stable";
  if (avgSecond > avgFirst + 5) trend = "improving";
  else if (avgSecond < avgFirst - 5) trend = "declining";

  return {
    title: "Your weekly summary",
    averageCompletion: avg,
    daysTracked: stats.length,
    goodDays,
    lowDays,
    trend,
    insight:
      trend === "improving"
        ? "Your performance is getting better."
        : trend === "declining"
        ? "Your performance dropped recently."
        : "Your performance has been consistent.",
    suggestion:
      avg < 60
        ? "Consider reducing workload slightly."
        : "Keep maintaining your routine."
  };
}

