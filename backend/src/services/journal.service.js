import JournalModel from "../models/book.model.js";
import Page from "../models/page.model.js"
import Template from "../models/template.model.js";

/* =========================================================
   🆕 CREATE JOURNAL
   Supports:
   1) Choose template now
   2) Choose template later
========================================================= */
export async function createJournalService(userId, payload) {
  const {
    title,
    journalType,
    templateId = null
  } = payload;

  if (!journalType) {
    throw new Error("Journal type is required");
  }

  /* 🧠 If template selected now → validate */
  let setupStatus = "CREATED";

  if (templateId) {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new Error("Invalid template");
    }

    if (template.journalType !== journalType) {
      throw new Error("Template does not belong to this journal type");
    }

    setupStatus = "READY";
  }

  const Journal = await JournalModel.create({
    userId,
    title: title?.trim() || "My Journal",
    journalType,
    defaultTemplateId: templateId,
    setupStatus,
    totalPages: 0,
    lastPageDate: null
  });

  return Journal;
}
/* =========================================================
   🎯 SELECT TEMPLATE FOR EXISTING JOURNAL
========================================================= */
export async function setJournalTemplate(
  userId,
  JournalId,
  templateId
) {
  const Journal = await JournalModel.findOne({
    _id: JournalId,
    userId,
    isArchived: false
  });

  if (!Journal) {
    throw new Error("Journal not found");
  }

  const template = await Template.findById(templateId);

  if (!template) {
    throw new Error("Invalid template");
  }

  /* 🧠 Ensure template matches journal type */
  if (template.journalType !== Journal.journalType) {
    throw new Error("Template not allowed for this journal type");
  }

  Journal.defaultTemplateId = templateId;
  Journal.setupStatus = "READY";

  await Journal.save();

  return Journal;
}

/* =========================================================
   📚 GET USER JOURNALS
========================================================= */
export async function getUserJournals(userId) {
  return JournalModel.find({
    userId,
    isArchived: false
  })
    .sort({ updatedAt: -1 })
    .lean();
}
/* =========================================================
   🔍 GET JOURNAL BY ID
========================================================= */
export async function getJournalById(userId, journalId) {
  const journal = await JournalModel.findOne({
    _id: journalId,
    userId,
    isArchived: false
  });

  if (!journal) {
    throw new Error("Journal not found or access denied");
  }

  return journal;
}
/* =========================================================
   📂 ARCHIVE JOURNAL
========================================================= */
export async function archiveJournalService(userId, JournalId) {
  const Journal = await JournalModel.findOneAndUpdate(
    { _id: JournalId, userId },
    { isArchived: true },
    { new: true }
  );

  if (!Journal) {
    throw new Error("Journal not found");
  }

  return Journal;
}
export async function journalHasPages(JournalId) {
  const page = await Page.findOne({ journalId: JournalId }).lean();
  return !!page;
}
export async function getLatestPageOfJournal(JournalId) {
  const latestPage = await Page.findOne({
    journalId: JournalId,
  })
    .sort({ date: -1 }) // newest date first
    .lean();

  return latestPage;
}
export async function getJournalResolverData(
  userId,
  JournalId
) {
  const Journal = await getJournalById(userId, JournalId);

  const latestPage = await getLatestPageOfJournal(
    JournalId
  );

  return {
    Journal,
    hasPages: !!latestPage,
    latestPageDate: latestPage?.date || null,
  };
}