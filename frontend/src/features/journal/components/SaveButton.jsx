export default function SaveButton({ onSave, saving }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  );
}