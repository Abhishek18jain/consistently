import BlankLayout from "./BlankLayout";
import TodoLayout from "./TodoLayout";
import PlannerLayout from "./PlannerLayout";
import TravelLayout from "./TravelLayout";
import MatrixLayout from "./MatrixLayout";
import HabitLayout from "./HabitLayout";
import BudgetLayout from "./BudgetLayout";
import PackingListLayout from "./PackingListLayout";
import WorkspaceLayout from "./WorkspaceLayout";
import EnergyPlannerLayout from "./EnergyPlannerLayout";
import FocusTodoLayout from "./FocusTodoLayout";
import DailyPlannerLayout from "./DailyPlannerLayout";
import GoalPlannerLayout from "./GoalPlannerLayout";
import DailyProductivePlanner from "./DailyProductivePlanner";
import TimeBlockingPlanner from "./TimeBlockingPlanner";


export default function TemplateRenderer({
  template,
  page,
  blocks,
  setBlocks,
}) {
  if (!template) {
    return (
      <BlankLayout
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  const kind = template.templateKind || template.type || "blank";
  const primaryBlockType = template.blocks?.[0]?.type || null;

  // ── Route by specific block type first ──

  if (primaryBlockType === "matrix") {
    return (
      <MatrixLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "habitGrid") {
    return (
      <HabitLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "budgetSummary") {
    return (
      <BudgetLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "packingList") {
    return (
      <PackingListLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "workspace" || primaryBlockType === "workspaceWidgets") {
    return (
      <WorkspaceLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "focusTodo" || primaryBlockType === "focusTasks") {
    return (
      <FocusTodoLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "energyPlanner" || primaryBlockType === "energySections") {
    return (
      <EnergyPlannerLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "dailyPlanner") {
    return (
      <DailyPlannerLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "goalPlanner") {
    return (
      <GoalPlannerLayout
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "dailyProductive") {
    return (
      <DailyProductivePlanner
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  if (primaryBlockType === "timeBlocking") {
    return (
      <TimeBlockingPlanner
        page={page}
        template={template}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  // ── Fallback by template kind/type ──


  switch (kind) {
    case "todo":
    case "focusTodo":
      return (
        <FocusTodoLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );

    case "energyPlanner":
      return (
        <EnergyPlannerLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );

    case "workspace":
      return (
        <WorkspaceLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );

    case "planner":
      return (
        <PlannerLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );

    case "travel":
      return (
        <TravelLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );

    case "blank":
    default:
      return (
        <BlankLayout
          page={page}
          template={template}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      );
  }
}
