import BlockEditor from "../BlockEditor";

/**
 * Planner Layout — clean light-themed card workspace
 */
export default function PlannerLayout({ template, blocks, setBlocks }) {
  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {template?.name || "Planner"}
        </h2>
        {template?.description && (
          <p className="text-sm text-gray-500 mt-0.5">
            {template.description}
          </p>
        )}
      </div>

      {/* Blocks rendered inside a card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <BlockEditor blocks={blocks} setBlocks={setBlocks} />
      </div>
    </div>
  );
}
