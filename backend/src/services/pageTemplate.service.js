import { randomUUID } from "crypto";

const SUPPORTED_BLOCK_TYPES = new Set([
  "text",
  "checklist",
  "divider",
]);

function makeTextBlock(text = "") {
  return {
    id: randomUUID(),
    type: "text",
    data: { text },
  };
}

function makeChecklistBlock(items = []) {
  return {
    id: randomUUID(),
    type: "checklist",
    data: { items },
  };
}

function normalizeTemplateStructure(structureJSON = []) {
  if (!Array.isArray(structureJSON)) return [];

  return structureJSON.map((block) => {
    const safeType = SUPPORTED_BLOCK_TYPES.has(block?.type)
      ? block.type
      : "text";

    let data = {};

    if (safeType === "text") {
      data = {
        text:
          typeof block?.data?.text === "string"
            ? block.data.text
            : "",
      };
    } else if (safeType === "checklist") {
      data = {
        items: Array.isArray(block?.data?.items)
          ? block.data.items
          : [],
      };
    }

    return {
      id:
        typeof block?.id === "string" && block.id.trim()
          ? block.id
          : randomUUID(),
      type: safeType,
      data,
    };
  });
}

function buildFallbackStructure(template) {
  const blockType = template?.blocks?.[0]?.type;

  switch (blockType) {
    case "matrix":
      return [
        makeTextBlock("Urgent & Important"),
        makeChecklistBlock(["Prepare for presentation", "Finish report"]),
        makeTextBlock("Important Not Urgent"),
        makeChecklistBlock(["Plan project roadmap", "Go to the gym"]),
        makeTextBlock("Urgent Not Important"),
        makeChecklistBlock(["Answer customer calls", "Buy office supplies"]),
        makeTextBlock("Not Urgent Not Important"),
        makeChecklistBlock(["Categorize old notes", "Scroll social media"]),
      ];

    case "focusTasks":
      return [
        makeChecklistBlock(["Top focus task", "Second task", "Third task"]),
        makeTextBlock("Notes"),
      ];

    case "energySections":
      return [
        makeTextBlock("High energy tasks"),
        makeChecklistBlock([""]),
        makeTextBlock("Medium energy tasks"),
        makeChecklistBlock([""]),
        makeTextBlock("Low energy tasks"),
        makeChecklistBlock([""]),
      ];

    case "habitGrid":
      return [makeChecklistBlock(["Exercise", "Read", "Drink water", "Study"])];

    case "workspaceWidgets":
      return [
        makeTextBlock("Top priorities"),
        makeChecklistBlock(["Task 1", "Task 2"]),
        makeTextBlock("Quick notes"),
      ];

    case "budgetSummary":
      return [
        makeTextBlock("Today's budget plan"),
        makeChecklistBlock(["Food - $0", "Transport - $0", "Other - $0"]),
        makeTextBlock("Spending notes"),
      ];

    case "packingList":
      return [
        makeChecklistBlock([
          "Passport",
          "Tickets",
          "Clothes",
          "Toiletries",
          "Chargers",
        ]),
      ];

    case "title":
      return [
        makeTextBlock(template?.name || "Travel Journal"),
        makeTextBlock("Write your trip notes here..."),
        makeChecklistBlock(["Mood: Great"]),
      ];

    case "quickNotes":
      return [makeTextBlock("")];

    case "algoRevision":
    case "codingProjectTracker":
    case "codingLearningJournal":
    case "dsaProblemTracker":
    case "codingProgressDashboard":
      return [makeChecklistBlock(["Item 1"])];

    default:
      if (template?.type === "todo") {
        return [
          makeChecklistBlock(["Task 1", "Task 2", "Task 3"]),
          makeTextBlock("Notes"),
        ];
      }

      if (template?.type === "planner") {
        return [
          makeTextBlock("Plan for today"),
          makeChecklistBlock([
            "Morning task",
            "Afternoon task",
            "Evening task",
          ]),
        ];
      }

      if (template?.type === "travel") {
        return [
          makeTextBlock("Trip highlights"),
          makeTextBlock("Memories"),
        ];
      }

      return [makeTextBlock("")];
  }
}

export function buildTemplateContent(template) {
  const normalized = normalizeTemplateStructure(template?.structureJSON);

  if (normalized.length > 0) {
    return normalized;
  }

  return buildFallbackStructure(template);
}
