import api from "../../services/axios";

export const getDashboardAnalyticsAPI = () => {
  return api.get("/analytics/dashboard");
};
