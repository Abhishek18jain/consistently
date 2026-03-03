export default function TextBlock({ data, onChange }) {
  return (
    <textarea
      className="w-full border p-3 rounded"
      value={data.text || ""}
      onChange={(e) =>
        onChange({ ...data, text: e.target.value })
      }
      placeholder="Write something..."
    />
  );
}