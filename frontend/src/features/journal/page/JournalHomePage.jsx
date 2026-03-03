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
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-8">
      
      {/* ===== HEADER ===== */}
      <h1 className="text-3xl font-semibold mb-8">
        Journals
      </h1>

      {/* ===== CREATE PRESETS ===== */}
      <CreatePresetSection onPresetClick={handlePresetClick} />

      {/* ===== JOURNAL LIST ===== */}
      <div className="mt-12">
        {loading ? (
          <p className="text-zinc-400">Loading journals...</p>
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