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
  {
    name: "Daily Planner",
    type: "todo",
    description: "Organize your day with schedule and priorities",
    thumbnail: "/templates/daily.png",
    tags: ["daily", "schedule"],
    blocks: [
      { type: "dailyPlanner" }
    ]
  },
  {
    name: "Goal Planner",
    type: "todo",
    description: "Multi-step goal tracking and progress",
    thumbnail: "/templates/goal.png",
    tags: ["goals", "planning"],
    blocks: [
      { type: "goalPlanner" }
    ]
  },
  {
    name: "Daily Planner Productive",
    type: "todo",
    description: "Priorities, schedule, notes and reflection for a productive day",
    thumbnail: "/templates/daily-productive.png",
    tags: ["daily", "productivity", "schedule"],
    blocks: [
      { type: "dailyProductive" }
    ]
  },
  {
    name: "Time Blocking Planner",
    type: "todo",
    description: "Block out time chunks on a visual timeline",
    thumbnail: "/templates/time-blocking.png",
    tags: ["time", "focus", "blocking"],
    blocks: [
      { type: "timeBlocking" }
    ]
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

  // ===== CODER =====
  {
    name: "Algorithm Revision Planner",
    type: "coder",
    description: "Track DSA topics, easy/medium/hard, and revision dates",
    thumbnail: "/templates/coder.png",
    tags: ["dsa", "algorithms", "revision"],
    blocks: [{ type: "algoRevision" }]
  },
  {
    name: "Coding Project Tracker",
    type: "coder",
    description: "Manage projects, tech stack, tasks, and bugs",
    thumbnail: "/templates/coder.png",
    tags: ["project", "tasks", "bugs"],
    blocks: [{ type: "codingProjectTracker" }]
  },
  {
    name: "Coding Learning Journal",
    type: "coder",
    description: "Daily reflections on concepts, problems, and solutions",
    thumbnail: "/templates/coder.png",
    tags: ["learning", "journal"],
    blocks: [{ type: "codingLearningJournal" }]
  },
  {
    name: "DSA Problem Tracker",
    type: "coder",
    description: "List solved DSA problems by topic and difficulty",
    thumbnail: "/templates/coder.png",
    tags: ["dsa", "problems"],
    blocks: [{ type: "dsaProblemTracker" }]
  },

  {
    name: "Coding Progress Dashboard",
    type: "coder",
    description: "Track coding streaks, problems solved, and difficulty distribution",
    thumbnail: "/templates/coder.png",
    tags: ["dashboard", "progress", "stats"],
    blocks: [{ type: "codingProgressDashboard" }]
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