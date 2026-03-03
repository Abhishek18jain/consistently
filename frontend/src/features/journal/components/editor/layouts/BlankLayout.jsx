import BlockEditor from "../BlockEditor";

export default function BlankLayout({ blocks, setBlocks }) {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <BlockEditor
        blocks={blocks}
        setBlocks={setBlocks}
      />
    </div>
  );
}
