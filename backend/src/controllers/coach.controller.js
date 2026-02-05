import * as coachService from "../services/coach.service.js";

export const getRiskStatus = async (req, res) => {
  const data = await coachService.getRiskStatus(req.user._id);
  res.json(data);
};

export const getStreakBreakReason = async (req, res) => {
  const data = await coachService.getStreakBreakReason(req.user._id);
  res.json(data);
};

export const getTomorrowAdvice = async (req, res) => {
  const data = await coachService.getTomorrowAdvice(req.user._id);
  res.json(data);
};

export const getWeakDaysCoach = async (req, res) => {
  const data = await coachService.getWeakDaysCoach(req.user._id);
  res.json(data);
};

export const getTodaySummary = async (req, res) => {
  const data = await coachService.getTodaySummary(req.user._id);
  res.json(data);
};
