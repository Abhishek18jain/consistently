import BlockEditor from "../BlockEditor";

export default function TravelLayout({
  template,
  blocks,
  setBlocks
}) {
  return (
    <div className="max-w-4xl mx-auto py-8">

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {template?.name || "Travel Log"}
        </h2>
        {template?.description ? (
          <p className="text-sm text-zinc-500 mt-1">
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
