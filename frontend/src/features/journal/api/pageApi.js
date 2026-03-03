import api from "../../../services/axios";

export const pageApi = {
  /* GET OR CREATE PAGE */
  getPageByDate: (journalId, date) =>
    api.get(`/pages/${journalId}/${date}`),

  /* NAVIGATION */
  getNextPage: (journalId, date) =>
    api.get(`/pages/${journalId}/${date}/next`),

  getPreviousPage: (journalId, date) =>
    api.get(`/pages/${journalId}/${date}/previous`),

  /* AUTOSAVE */
  updatePage: (pageId, contentJSON) =>
    api.patch(`/pages/${pageId}`, {
      contentJSON,
    }),

  /* TEMPLATE */
  createFromTemplate: (journalId, templateId) =>
    api.post("/pages/from-template", {
      journalId,
      templateId,
    }),
};