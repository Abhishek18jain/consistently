import {
  createPageFromTemplate,
  getPageByDate,
  getNextPage,
  getPreviousPage,
  updatePageContent,
  createBlankPage,
  getOrCreatePageByDate,
} from "../services/page.service.js";

/* =========================================================
   📄 CREATE PAGE FROM TEMPLATE (TODAY)
========================================================= */
export async function createFromTemplate(req, res) {
  try {
    
    console.log(req.body); // 👈 ADD THIS
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
   If next page exists → return it
   Else → create blank page for next date
========================================================= */
export async function nextPage(req, res) {
  try {
    const { journalId, date } = req.params;

    let page = await getNextPage({ journalId, date });

    if (!page) {
      // compute next calendar date
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
   Only returns existing pages
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
   💾 AUTOSAVE PAGE CONTENT
========================================================= */
export async function updatePage(req, res) {
  try {
    const { pageId } = req.params;
    const { contentJSON } = req.body;

    const page = await updatePageContent({
      pageId,
      contentJSON,
    });

    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}