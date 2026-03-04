import BlockEditor from "../BlockEditor";

/**
 * Todo Layout — light top-themed card wrapper for simple todo blocks
 */
export default function TodoLayout({ template, blocks, setBlocks }) {
  return (
    <div className="py-3">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {template?.name || "Today's Tasks"}
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
