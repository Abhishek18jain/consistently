import {
  getDashboardAnalytics,
  getMonthlyHeatmap,
  getProfileAnalytics
} from "../services/analytics.service.js";

/**
 * GET /analytics/dashboard
 */
export async function dashboardAnalytics(req, res, next) {
  try {
    const data = await getDashboardAnalytics(req.user.userId);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /analytics/heatmap/:year/:month
 */
export async function monthlyHeatmap(req, res, next) {
  try {
    const { year, month } = req.params;
    const data = await getMonthlyHeatmap(
      req.user.userId,
      Number(year),
      Number(month)
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /analytics/profile
 */
export async function profileAnalytics(req, res, next) {
  try {
    const data = await getProfileAnalytics(req.user.userId);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
