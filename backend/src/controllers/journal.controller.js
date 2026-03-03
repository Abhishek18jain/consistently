import {
  createJournalService,
  setJournalTemplate,
  getUserJournals,
  getJournalById,
  archiveJournalService,
    getJournalResolverData,

} from "../services/journal.service.js";
import Template from "../models/template.model.js";
import Journal from "../models/book.model.js"
/**
 * POST /journals
 * Create journal
 */
export async function createJournal(req, res, next) {
  try {
    console.log("BODY:", req.body);

    const Journal = await createJournalService(
      req.user.userId,
      req.body
    );

    // 🔥 RETURN FULL OBJECT
    res.status(201).json({
      message: "Journal created",
      journal: Journal,   // ← THIS IS WHAT FRONTEND EXPECTS
    });

  } catch (err) {
    next(err);
  }
}
/**
 * PUT /journals/:id/template
 * Select template for existing journal
 */
export async function selectTemplate(req, res, next) {
  try {
    const { templateId } = req.body;

    const Journal = await setJournalTemplate(
      req.user.userId,
      req.params.id,
      templateId
    );

    res.status(200).json({
      message: "Template selected",
      JournalId: Journal._id,
      setupStatus: Journal.setupStatus,
      templateId: Journal.defaultTemplateId,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /journals
 */
export async function listJournals(req, res, next) {
  try {
    const Journals = await getUserJournals(
      req.user.userId
    );

    res.status(200).json(Journals);
  } catch (err) {
    next(err);
  }
}
/**
 * GET /journals/:id/open
 * Determine navigation state
 */
export async function openJournal(req, res, next) {
  try {
    const Journal = await getJournalById(
      req.user.userId,
      req.params.id
    );

    if (Journal.isArchived) {
      return res.status(403).json({
        message: "Journal is archived",
      });
    }

    /* 🚨 Setup incomplete → choose template */
    if (Journal.setupStatus !== "READY") {
      return res.status(200).json({
        status: "SETUP_REQUIRED",
        JournalId: Journal._id,
        journalType: Journal.journalType,
      });
    }

    /* 📖 If page exists → open it */
    if (Journal.currentPageId) {
      return res.status(200).json({
        status: "HAS_PAGE",
        JournalId: Journal._id,
        pageId: Journal.currentPageId,
        templateId: Journal.defaultTemplateId,
      });
    }

    /* 🆕 No page yet → create first page flow */
    return res.status(200).json({
      status: "NO_PAGE",
      JournalId: Journal._id,
      templateId: Journal.defaultTemplateId,
    });
  } catch (err) {
    next(err);
  }
}
export const getTemplatesForJournal = async (req, res) => {
  const { id } = req.params;

  const journal = await Journal.findById(id);
  if (!journal) {
    return res.status(404).json({ error: "Journal not found" });
  }

  const templates = await Template.find({
    journalType: journal.journalType,
  });

  res.json({ templates });
};
/**
 * PUT /journals/:id/archive
 */
export async function archiveJournal(req, res, next) {
  try {
    const Journal = await archiveJournalService(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      message: "Journal archived",
      JournalId: Journal._id,
    });
  } catch (err) {
    next(err);
  }
}
export async function resolveJournalEntry(
  req,
  res,
  next
) {
  try {
    const { id } = req.params;

    const data = await getJournalResolverData(
      req.user.userId,
      id
    );

    /* 🚨 No pages → template selection */
    if (!data.hasPages) {
      return res.status(200).json({
        status: "SETUP_REQUIRED",
        journalId: data.Journal._id,
        journalType: data.Journal.journalType,
      });
    }

    /* 📖 Has pages → open latest editor */
    return res.status(200).json({
      status: "OPEN_EDITOR",
      journalId: data.Journal._id,
      date: data.latestPageDate,
    });
  } catch (err) {
    next(err);
  }
}
export async function getJournal(req, res, next) {
  try {
    const journal = await getJournalById(
      req.user.userId,
      req.params.id
    );

    res.status(200).json(journal);
  } catch (err) {
    next(err);
  }
}