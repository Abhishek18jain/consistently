import BlankLayout from "./BlankLayout";
import TodoLayout from "./TodoLayout";
import PlannerLayout from "./PlannerLayout";
import TravelLayout from "./TravelLayout";
import MatrixLayout from "./MatrixLayout";

export default function TemplateRenderer({
  template,
  page,
  blocks,
  setBlocks
}) {
  if (!template) {
    return (
      <BlankLayout
        blocks={blocks}
        setBlocks={setBlocks}
      />
    );
  }

  const kind =
    template.templateKind ||
    template.type ||
    "blank";
  const primaryBlockType =
    template.blocks?.[0]?.type || null;

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

  switch (kind) {

    case "todo":
      return (
        <TodoLayout
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
