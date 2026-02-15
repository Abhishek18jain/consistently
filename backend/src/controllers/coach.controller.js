import { runCoach } from "../services/coach.service.js";

/**
 * GET /coach/:questionKey
 */
export async function coachQuery(req, res, next) {
  try {
    const { questionKey } = req.params;
    const response = await runCoach(req.user.userId, questionKey);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
