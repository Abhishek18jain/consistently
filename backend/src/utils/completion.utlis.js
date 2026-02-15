/**
 * completion.util.js
 * -------------------
 * Single source of truth for page completion logic.
 * Pure functions only. No DB access. No side effects.
 */

/**
 * Calculate completion percentage for a page
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
 * Used for: todo, grocery
 *
 * Expected content shape:
 * {
 *   items: string[],
 *   completedItems: string[]
 * }
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
 * Used for: study, work
 *
 * Expected content shape:
 * {
 *   planned: number,
 *   completed: number
 * }
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
