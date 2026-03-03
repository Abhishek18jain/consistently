import api from "../../services/axios";

export const getDashboardAnalyticsAPI = async () => {
  const res = await api.get("/analytics/dashboard");
  return res.data;
};
