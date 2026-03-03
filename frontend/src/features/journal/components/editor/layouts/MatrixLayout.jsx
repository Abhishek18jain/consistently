import BlockEditor from "../BlockEditor";

export default function MatrixLayout({
  template,
  blocks,
  setBlocks
}) {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          {template?.name || "Eisenhower Matrix"}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Prioritize by urgency and importance.
        </p>
      </div>
      <BlockEditor
        blocks={blocks}
        setBlocks={setBlocks}
      />
    </div>
  );
}
