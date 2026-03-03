import {
  createPageFromTemplate,
  getPageByDate,
  getNextPage,
  getPreviousPage,
  updatePageContent,
  createBlankPage,
  getOrCreatePageByDate,
} from "../services/page.service.js";
import { processPageCompletion } from "../services/dailyStats.service.js";
import Journal from "../models/book.model.js";

/* =========================================================
   📄 CREATE PAGE FROM TEMPLATE (TODAY)
========================================================= */
export async function createFromTemplate(req, res) {
  try {
    console.log(req.body);
    const { journalId, templateId } = req.body;

    const page = await createPageFromTemplate({
      journalId,
      templateId,
    });
    res.status(201).json(page);
  } catch (err) {
    console.error("CREATE FROM TEMPLATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}

/* =========================================================
   🧠 GET OR CREATE PAGE BY DATE  ⭐ CRITICAL
========================================================= */
export async function getPage(req, res) {
  try {
    const { journalId, date } = req.params;

    const page = await getOrCreatePageByDate({
      journalId,
      date,
    });

    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* =========================================================
   ➡️ NEXT PAGE NAVIGATION
========================================================= */
export async function nextPage(req, res) {
  try {
    const { journalId, date } = req.params;

    let page = await getNextPage({ journalId, date });

    if (!page) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const nextDateString = nextDate
        .toISOString()
        .split("T")[0];

      page = await createBlankPage({
        journalId,
        date: nextDateString,
      });
    }

    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* =========================================================
   ⬅️ PREVIOUS PAGE NAVIGATION
========================================================= */
export async function previousPage(req, res) {
  try {
    const { journalId, date } = req.params;

    const page = await getPreviousPage({
      journalId,
      date,
    });

    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* =========================================================
   🆕 CREATE BLANK PAGE MANUALLY
========================================================= */
export async function createBlank(req, res) {
  try {
    const { journalId, date } = req.body;

    const page = await createBlankPage({
      journalId,
      date,
    });

    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* =========================================================
   💾 SAVE PAGE CONTENT + TRIGGER STREAK ENGINE
   This is the critical path that feeds data to the coach.

   Flow: Save blocks → Calculate completion → Upsert DailyStats
         → Process streak → Return everything to frontend
========================================================= */
export async function updatePage(req, res) {
  try {
    const { pageId } = req.params;
    const { contentJSON } = req.body;
    const userId = req.user.userId;

    // 1. Save the page content
    const page = await updatePageContent({
      pageId,
      contentJSON,
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // 2. Get journal to know the type
    const journal = await Journal.findById(page.journalId)
      .select("journalType")
      .lean();

    const journalType = journal?.journalType || "blank";

    // 3. Run the completion → DailyStats → Streak pipeline
    let completionResult = null;

    try {
      completionResult = await processPageCompletion({
        userId,
        journalId: page.journalId.toString(),
        pageId: page._id.toString(),
        date: page.date,
        blocks: contentJSON,
        journalType,
      });
    } catch (err) {
      // Don't fail the save if streak processing fails
      console.error("Completion processing error:", err);
    }

    // 4. Return page + completion data
    res.status(200).json({
      ...page.toObject(),
      completion: completionResult?.completionData || null,
      streak: completionResult?.streakResult || null,
    });
  } catch (err) {
    console.error("UPDATE PAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}