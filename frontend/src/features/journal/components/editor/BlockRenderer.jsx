import TextBlock from "./blocks/TextBlock";
import ChecklistBlock from "./blocks/ChecklistBlock";
import DividerBlock from "./blocks/DividerBlock";

export default function BlockRenderer({ block, updateBlock }) {
  switch (block.type) {
    case "text":
      return (
        <TextBlock
          data={block.data}
          onChange={(d) => updateBlock(block.id, d)}
        />
      );

    case "checklist":
      return (
        <ChecklistBlock
          data={block.data}
          onChange={(d) => updateBlock(block.id, d)}
        />
      );

    case "divider":
      return <DividerBlock />;

    default:
      return <div>Unsupported block</div>;
  }
}