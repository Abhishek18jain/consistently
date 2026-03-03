// services/page.service.js

import Journal from "../models/book.model.js";
import Page from "../models/page.model.js";
import Template from "../models/template.model.js";
import { getTodayDateString } from "../utils/date.util.js";
import { buildTemplateContent } from "./pageTemplate.service.js";

function isEffectivelyBlankContent(contentJSON = []) {
  if (!Array.isArray(contentJSON) || contentJSON.length === 0) {
    return true;
  }

  if (contentJSON.length === 1) {
    const block = contentJSON[0];

    if (block?.type === "text") {
      return !block?.data?.text?.trim?.();
    }

    if (block?.type === "checklist") {
      return !Array.isArray(block?.data?.items) || block.data.items.length === 0;
    }
  }

  return false;
}

async function updateJournalAfterPageCreate({
  journalId,
  pageId,
  date,
  templateId,
}) {
  const setUpdate = {
    currentPageId: pageId,
    currentPageDate: date,
    lastPageDate: date,
  };

  if (templateId) {
    setUpdate.defaultTemplateId = templateId;
    setUpdate.setupStatus = "READY";
  }

  await Journal.findByIdAndUpdate(
    journalId,
    {
      $set: setUpdate,
      $inc: { totalPages: 1 },
    },
    { new: true }
  );
}

/**
 * CREATE PAGE FROM TEMPLATE FOR TODAY
 */
export async function createPageFromTemplate({ journalId, templateId }) {
  const today = getTodayDateString();

  const existing = await Page.findOne({ journalId, date: today });
  if (existing) {
    await Journal.findByIdAndUpdate(
      journalId,
      {
        defaultTemplateId: templateId,
        setupStatus: "READY",
        currentPageId: existing._id,
        currentPageDate: existing.date,
      },
      { new: true }
    );

    return existing;
  }

  const template = await Template.findById(templateId);
  if (!template) throw new Error("Template not found");

  const content = buildTemplateContent(template);

  const page = await Page.create({
    journalId,
    date: today,
    contentJSON: content,
    createdFromTemplateId: templateId,
  });

  await updateJournalAfterPageCreate({
    journalId,
    pageId: page._id,
    date: today,
    templateId,
  });

  return page;
}

export async function getPageByDate({ journalId, date }) {
  return Page.findOne({ journalId, date });
}

export async function getNextPage({ journalId, date }) {
  return Page.findOne({
    journalId,
    date: { $gt: date },
  }).sort({ date: 1 });
}

export async function getPreviousPage({ journalId, date }) {
  return Page.findOne({
    journalId,
    date: { $lt: date },
  }).sort({ date: -1 });
}

export async function updatePageContent({ pageId, contentJSON }) {
  const page = await Page.findByIdAndUpdate(
    pageId,
    { contentJSON },
    { new: true }
  );

  return page;
}

/* =========================================================
   CREATE BLANK PAGE FOR A DATE
========================================================= */
export async function createBlankPage({
  journalId,
  date,
}) {
  const existing = await Page.findOne({
    journalId,
    date,
  });

  if (existing) return existing;

  let template = null;

  const journal = await Journal.findById(journalId).select(
    "defaultTemplateId"
  );

  if (journal?.defaultTemplateId) {
    template = await Template.findById(journal.defaultTemplateId);
  }

  const content = template
    ? buildTemplateContent(template)
    : [];

  const page = await Page.create({
    journalId,
    date,
    contentJSON: content,
    createdFromTemplateId: template?._id || null,
  });

  await updateJournalAfterPageCreate({
    journalId,
    pageId: page._id,
    date,
    templateId: template?._id || null,
  });

  return page;
}

/* =========================================================
   GET OR CREATE PAGE FOR DATE
========================================================= */
export async function getOrCreatePageByDate({
  journalId,
  date,
}) {
  const existingPage = await Page.findOne({
    journalId,
    date,
  });

  if (!existingPage) {
    return createBlankPage({
      journalId,
      date,
    });
  }

  if (
    !existingPage.createdFromTemplateId &&
    isEffectivelyBlankContent(existingPage.contentJSON)
  ) {
    const journal = await Journal.findById(journalId).select(
      "defaultTemplateId"
    );

    if (journal?.defaultTemplateId) {
      const template = await Template.findById(journal.defaultTemplateId);

      if (template) {
        existingPage.contentJSON = buildTemplateContent(template);
        existingPage.createdFromTemplateId = template._id;
        await existingPage.save();
      }
    }
  }

  return existingPage;
}

/* =========================================================
   GET LATEST PAGE OF JOURNAL
========================================================= */
export async function getLatestPage(journalId) {
  return Page.findOne({ journalId })
    .sort({ date: -1 });
}
