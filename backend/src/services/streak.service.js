import DailyStats from "../models/DailyStats.model.js";
import StreakEvent from "../models/streakevent.model.js";
import User from "../models/user.model.js";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const evaluateDay = async ({
  userId,
  date,
  completionPercent,
  bookId,
  pageId,
}) => {
  const day = startOfDay(date);

  let status = "fail";
  if (completionPercent >= 70) status = "success";
  else if (completionPercent >= 60) status = "near-miss";

  // upsert daily stats
  const dailyStat = await DailyStats.findOneAndUpdate(
    { user: userId, date: day },
    {
      user: userId,
      date: day,
      completionPercent,
      status,
      book: bookId,
      page: pageId,
    },
    { upsert: true, new: true }
  );

  // fetch user
  const user = await User.findById(userId);

  // SUCCESS DAY
  if (status === "success") {
    user.currentStreak += 1;
    if (user.currentStreak > user.bestStreak) {
      user.bestStreak = user.currentStreak;
    }
    await user.save();
    return;
  }

  // NEAR MISS → do nothing, but streak at risk
  if (status === "near-miss") {
    // streak not incremented, not broken
    return;
  }

  // FAILURE → BREAK STREAK
  if (status === "fail" && user.currentStreak > 0) {
    await StreakEvent.create({
      user: userId,
      date: day,
      previousStreak: user.currentStreak,
      reason: "below-threshold",
      completionPercent,
    });

    user.currentStreak = 0;
    await user.save();
  }
};
