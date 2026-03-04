// features/journal/pages/JournalHomePage.jsx

import { useState } from "react";

import useJournals from "../hooks/useJournal.js";

import CreatePresetSection from "../components/home/CreatePresetSection.jsx";
import JournalGrid from "../components/home/JournalGrid.jsx";
import CreateJournalModal from "../components/home/CreateJournalModal.jsx";

export default function JournalHomePage() {
  /* 🔥 Fetch journals */
  const { journals, loading, refresh } = useJournals();

  /* 🔥 Modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  /* =========================
     Preset Click → Open Modal
     ========================= */
  const handlePresetClick = (presetType) => {
    setSelectedPreset(presetType);
    setIsModalOpen(true);
  };

  /* =========================
     After Journal Created
     ========================= */
  const handleCreated = () => {
    setIsModalOpen(false);
    setSelectedPreset(null);

    // 🔥 Refresh journals list so new one appears
    refresh();
  };

  return (
    <div className="space-y-8">

      {/* ===== HEADER ===== */}
      <h1 className="text-2xl font-bold text-gray-900">
        Journals
      </h1>

      {/* ===== CREATE PRESETS ===== */}
      <CreatePresetSection onPresetClick={handlePresetClick} />

      {/* ===== JOURNAL LIST ===== */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading journals…</p>
            </div>
          </div>
        ) : (
          <JournalGrid journals={journals} />
        )}
      </div>

      {/* ===== CREATE JOURNAL MODAL ===== */}
      <CreateJournalModal
        isOpen={isModalOpen}
        presetType={selectedPreset}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}