"use client";

import { useState } from "react";

interface SaveModalProps {
  timeMs: number;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

export default function SaveModal({ timeMs, onSave, onCancel }: SaveModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes > 0 ? `${minutes}:` : ""}${
      seconds < 10 && minutes > 0 ? "0" : ""
    }${seconds}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    await onSave(name.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
        <h2 className="text-2xl font-bold text-white mb-2">Waktu Tersimpan!</h2>
        <p className="text-gray-400 mb-6">
          Anda berhasil menyelesaikan dalam waktu <span className="text-indigo-400 font-mono font-bold">{formatTime(timeMs)}</span>.
          Silakan masukkan nama Anda untuk menyimpan ke Leaderboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="participant_name" className="block text-sm font-medium text-gray-300 mb-2">
              Nama Peserta
            </label>
            <input
              type="text"
              id="participant_name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Masukkan nama Anda..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex justify-center items-center"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Simpan ke Leaderboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
