import BlockEditor from "../BlockEditor";

/**
 * Todo Layout — dark-themed card wrapper for simple todo blocks
 */
export default function TodoLayout({ template, blocks, setBlocks }) {
  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-100">
          {template?.name || "Today's Tasks"}
        </h2>
        {template?.description && (
          <p className="text-sm text-zinc-400 mt-0.5">
            {template.description}
          </p>
        )}
      </div>

      {/* Blocks rendered inside a card */}
      <div className="bg-zinc-800/40 rounded-2xl border border-zinc-700/30 p-5">
        <BlockEditor blocks={blocks} setBlocks={setBlocks} />
      </div>
    </div>
  );
}
