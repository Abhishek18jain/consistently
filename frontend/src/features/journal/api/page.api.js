import api from "../../../services/axios";

/* 📄 PAGES */

export const startPageAPI = (payload) =>
  api.post("/pages/start", payload);

export const navigatePageAPI = (payload) =>
  api.post("/pages/navigate", payload);

export const savePageAPI = (payload) =>
  api.put("/pages", payload);