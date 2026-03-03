export const templates = [

  // ===== TODO =====
  {
    name: "Eisenhower Matrix",
    type: "todo",
    description: "Prioritize tasks by urgency and importance",
    thumbnail: "/templates/eisenhower.png",
    tags: ["priority", "productivity"],
    blocks: [{ type: "matrix", variant: "eisenhower" }]
  },
  {
    name: "Focus Mode Todo",
    type: "todo",
    description: "Tasks with Pomodoro focus timer",
    thumbnail: "/templates/focus.png",
    tags: ["focus", "pomodoro"],
    blocks: [{ type: "focusTasks" }]
  },
  {
    name: "Energy Planner",
    type: "todo",
    description: "Plan tasks based on energy level",
    thumbnail: "/templates/energy.png",
    tags: ["energy", "planning"],
    blocks: [{ type: "energySections" }]
  },

  // ===== PLANNER =====
  {
    name: "Habit Tracker",
    type: "planner",
    description: "Track daily habits weekly",
    thumbnail: "/templates/habits.png",
    tags: ["habits"],
    blocks: [{ type: "habitGrid" }]
  },
  {
    name: "Workspace Dashboard",
    type: "planner",
    description: "Checklist, notes, calendar, tasks",
    thumbnail: "/templates/workspace.png",
    tags: ["dashboard"],
    blocks: [{ type: "workspaceWidgets" }]
  },
  {
    name: "Budget Tracker",
    type: "planner",
    description: "Track expenses and budget",
    thumbnail: "/templates/budget.png",
    tags: ["finance"],
    blocks: [{ type: "budgetSummary" }]
  },
  {
    name: "Packing List",
    type: "planner",
    description: "Prepare items for trips",
    thumbnail: "/templates/packing.png",
    tags: ["travel", "checklist"],
    blocks: [{ type: "packingList" }]
  },

  // ===== TRAVEL =====
  {
    name: "Travel Journal",
    type: "travel",
    description: "Capture trip memories",
    thumbnail: "/templates/travel.png",
    tags: ["journal"],
    blocks: [
      { type: "title" },
      { type: "text" },
      { type: "images" },
      { type: "mood" }
    ]
  },

  // ===== BLANK =====
  {
    name: "Brain Dump",
    type: "blank",
    description: "Quickly capture thoughts",
    thumbnail: "/templates/braindump.png",
    tags: ["notes"],
    blocks: [{ type: "quickNotes" }]
  },
  {
    name: "Blank Editor",
    type: "blank",
    description: "Start from scratch",
    thumbnail: "/templates/blank.png",
    tags: ["empty"],
    blocks: []
  }
];