import BlockRenderer from "./BlockRenderer";

export default function BlockEditor({ blocks = [], setBlocks }) {
  const updateBlock = (id, newData) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, data: newData } : b
      )
    );
  };

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          updateBlock={updateBlock}
        />
      ))}
    </div>
  );
}