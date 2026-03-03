import api from "../../../services/axios";

export const journalApi = {
  resolveJournal: (journalId) =>
    api.get(`journals/${journalId}/resolver`),
    openJournal: (journalId) =>
    api.get(`/journals/${journalId}/open`),


  getJournalById: (journalId) =>
    api.get(`/journals/${journalId}`),

  getJournals: () => api.get("/journals"),

  createJournal: (payload) =>
    api.post("/journals", payload),
}
export const templateApi = {
  getTemplatesByType: (type) =>
    api.get(`/templates?type=${type}`),
  getTemplateById: (id) =>
  api.get(`/templates/${id}`)
};

export const openJournalAPI = (bookId) =>
  api.get(`/journals/${bookId}/open`);
