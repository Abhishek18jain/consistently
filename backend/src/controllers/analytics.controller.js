import * as analyticsService from "../services/analytics.service.js";

export const getMonthlyHeatmap = async (req, res) => {
  const { month, year } = req.query;
  const data = await analyticsService.getMonthlyHeatmap(
    req.user._id,
    Number(month),
    Number(year)
  );
  res.json(data);
};

export const getStreakSummary = async (req, res) => {
  const data = await analyticsService.getStreakSummary(req.user._id);
  res.json(data);
};

export const getConsistencyScore = async (req, res) => {
  const score = await analyticsService.getConsistencyScore(req.user._id);
  res.json({ score });
};

export const getWeakDays = async (req, res) => {
  const data = await analyticsService.getWeakDays(req.user._id);
  res.json(data);
};
