// src/features/workspace/api/workspace.api.js

import api from "../../services/axios";

/* Workspace */

export const getWorkspaceStatusAPI = () =>
  api.get("/workspace/status");


/* Journals */

export const getJournalsAPI = () =>
  api.get("/journals");

export const createJournalAPI = (payload) =>
  api.post("/journals", payload);

export const startJournalAPI = (bookId) =>
  api.post(`/journals/${bookId}/start`);


/* Pages */

export const getTodayPageAPI = (bookId) =>
  api.get(`/pages/today/${bookId}`);