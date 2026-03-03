export default function ChecklistBlock({ data, onChange }) {
  const items = data.items || [];

  const updateItem = (i, text) => {
    const updated = [...items];
    updated[i] = text;
    onChange({ items: updated });
  };

  return (
    <div>
      {items.map((item, i) => (
        <input
          key={i}
          className="block w-full border mb-2 p-2"
          value={item}
          onChange={(e) =>
            updateItem(i, e.target.value)
          }
        />
      ))}
    </div>
  );
}