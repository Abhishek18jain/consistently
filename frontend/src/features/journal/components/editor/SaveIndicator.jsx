// components/editor/SavingIndicator.jsx

export default function SavingIndicator({ isSaving }) {
  return (
    <div className="fixed bottom-4 right-6 text-sm text-gray-500">
      {isSaving ? "Saving..." : "Saved"}
    </div>
  );
}