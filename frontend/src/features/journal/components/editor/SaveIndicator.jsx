export default function SavingIndicator({ isSaving, onSave }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className={`
          flex items-center gap-2.5 px-6 py-3 rounded-full
          shadow-lg text-sm font-semibold
          transition-all duration-300 cursor-pointer
          active:scale-95
          ${isSaving
            ? "bg-amber-500 text-white shadow-amber-500/30"
            : "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl"
          }
        `}
      >
        {isSaving ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
            Saving…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17,21 17,13 7,13 7,21" />
              <polyline points="7,3 7,8 15,8" />
            </svg>
            Save
          </>
        )}
      </button>
    </div>
  );
}