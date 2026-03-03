import BlockEditor from "../BlockEditor";

/**
 * Planner Layout — clean dark-themed card workspace
 */
export default function PlannerLayout({ template, blocks, setBlocks }) {
  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-100">
          {template?.name || "Planner"}
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
