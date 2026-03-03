import BlockEditor from "../BlockEditor";

export default function PlannerLayout({
  template,
  blocks,
  setBlocks
}) {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">

      <div>
        <h2 className="text-2xl font-semibold mb-1">
          {template?.name || "Planner"}
        </h2>
        {template?.description ? (
          <p className="text-sm text-zinc-500">
            {template.description}
          </p>
        ) : null}
      </div>

      <BlockEditor
        blocks={blocks}
        setBlocks={setBlocks}
      />

    </div>
  );
}
