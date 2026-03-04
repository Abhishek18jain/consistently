import {
  createJournalService,
  setJournalTemplate,
  getUserJournals,
  getJournalById,
  archiveJournalService,
    getJournalResolverData,

} from "../services/journal.service.js";
import Template from "../models/template.model.js";
import PageModel from "../models/page.model.js";
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
    const journal = await getJournalById(
      req.user.userId,
      req.params.id
    );

    if (journal.isArchived) {
      return res.status(403).json({
        message: "Journal is archived",
      });
    }

    if (!journal.defaultTemplateId) {
      return res.status(200).json({
        status: "SETUP_REQUIRED",
        journalId: journal._id,
        journalType: journal.journalType,
        totalPages: 0,
        lastPageDate: null
      });
    }

    const totalPages = journal.totalPages;
    const lastPageDate = journal.lastPageDate;

    return res.status(200).json({
      status: totalPages ? "HAS_PAGE" : "NO_PAGE",
      journalId: journal._id,
      templateId: journal.defaultTemplateId,
      totalPages,
      lastPageDate
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