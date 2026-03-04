/**
 * completion.util.js
 * -------------------
 * Single source of truth for page completion logic.
 * Pure functions only. No DB access. No side effects.
 */

/**
 * Calculate completion from raw contentJSON blocks.
 * This is the PRIMARY function used when saving pages.
 *
 * Works with actual page block structure:
 *   [{ type: "checklist", data: { items: [{ text, checked }] } }, ...]
 *
 * @param {Array} blocks - contentJSON blocks from the page
 * @param {String} journalType - "todo" | "planner" | "travel" | "blank" etc.
 * @returns {Object} { completion, success, nearMiss, excluded, totalTasks, completedTasks }
 */
export function calculateCompletionFromBlocks(blocks = [], journalType = "blank") {
  // Non-trackable journal types
  const NON_TRACKABLE = ["blank", "travel", "reflection"];

  if (NON_TRACKABLE.includes(journalType)) {
    return {
      completion: 0,
      success: false,
      nearMiss: false,
      excluded: true,
      totalTasks: 0,
      completedTasks: 0,
    };
  }

  // Extract all checklist items across all checklist blocks
  let totalTasks = 0;
  let completedTasks = 0;

  for (const block of blocks) {
    // Standard checklist blocks
    if (block.type === "checklist") {
      const items = Array.isArray(block.data?.items) ? block.data.items : [];
      for (const item of items) {
        if (typeof item === "string") {
          if (item.trim()) totalTasks++;
        } else if (item && typeof item === "object") {
          const text = item.text?.trim?.() || "";
          if (text) {
            totalTasks++;
            if (item.checked) completedTasks++;
          }
        }
      }
    }

    // Special block types — focusTasks, dailyPlanner, goalPlanner
    // These are stored as blocks with special types but contain items in data
    if (["focusTasks", "dailyPlanner", "goalPlanner", "energySections", "habitGrid", "dailyProductive", "timeBlocking"].includes(block.type)) {
      const items = block.data?.items || block.data?.tasks || [];
      if (Array.isArray(items)) {
        for (const item of items) {
          const text = typeof item === "string" ? item : item?.text || "";
          if (text.trim()) {
            totalTasks++;
            if (item?.checked) completedTasks++;
          }
        }
      }
    }
  }

  // No tasks = nothing to track
  if (totalTasks === 0) {
    return {
      completion: 0,
      success: false,
      nearMiss: false,
      excluded: true, // no tasks = excluded from streak
      totalTasks: 0,
      completedTasks: 0,
    };
  }

  const completion = Math.round((completedTasks / totalTasks) * 100);

  return {
    completion,
    success: isSuccess(completion),
    nearMiss: isNearMiss(completion),
    excluded: false,
    totalTasks,
    completedTasks,
  };
}


/**
 * Legacy: Calculate completion percentage for a page using template rules
 * @param {Object} template - Template document from DB
 * @param {Object} content - User filled page content
 * @returns {Object} { completion, success, nearMiss, excluded }
 */
export function calculateCompletion(template, content = {}) {
  if (!template || !template.completionRule) {
    throw new Error("Template or completion rule missing");
  }

  // Reflection or non-analytic templates
  if (!template.affectsStreak) {
    return {
      completion: 0,
      success: false,
      nearMiss: false,
      excluded: true
    };
  }

  let completion = 0;

  switch (template.completionRule) {
    case "checklist":
      completion = checklistRule(content);
      break;

    case "ratio":
      completion = ratioRule(content);
      break;

    case "manual":
      // Manual entries never count toward streaks
      return {
        completion: 0,
        success: false,
        nearMiss: false,
        excluded: true
      };

    default:
      throw new Error(`Unsupported completion rule: ${template.completionRule}`);
  }

  const rounded = Math.round(completion);

  return {
    completion: rounded,
    success: isSuccess(rounded),
    nearMiss: isNearMiss(rounded),
    excluded: false
  };
}

/* ------------------------------------------------------------------ */
/* ------------------------- RULE IMPLEMENTATIONS -------------------- */
/* ------------------------------------------------------------------ */

/**
 * Checklist Rule
 */
function checklistRule(content) {
  const items = Array.isArray(content.items) ? content.items : [];
  const completed = Array.isArray(content.completedItems)
    ? content.completedItems
    : [];

  if (items.length === 0) return 0;

  const completedCount = completed.filter(item =>
    items.includes(item)
  ).length;

  return (completedCount / items.length) * 100;
}

/**
 * Ratio Rule
 */
function ratioRule(content) {
  const planned = Number(content.planned);
  const completed = Number(content.completed);

  if (!planned || planned <= 0) return 0;

  const safeCompleted = Math.min(completed, planned);

  return (safeCompleted / planned) * 100;
}

/* ------------------------------------------------------------------ */
/* --------------------------- HELPERS -------------------------------- */
/* ------------------------------------------------------------------ */

export function isSuccess(completion) {
  return completion >= 70;
}

export function isNearMiss(completion) {
  return completion >= 60 && completion < 70;
}
