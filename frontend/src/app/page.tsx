"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Timer from "@/components/Timer";
import Leaderboard, { RecordData } from "@/components/Leaderboard";
import SaveModal from "@/components/SaveModal";

const API_URL = "http://localhost:5000/api/records";

export default function Home() {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setRecords(response.data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleTimeRecorded = (timeMs: number) => {
    setCurrentTimeMs(timeMs);
    setShowModal(true);
  };

  const handleSaveRecord = async (name: string) => {
    try {
      await axios.post(API_URL, {
        participant_name: name,
        time_ms: currentTimeMs,
      });
      setShowModal(false);
      fetchRecords(); // Refresh leaderboard
    } catch (error) {
      console.error("Failed to save record", error);
      alert("Gagal menyimpan rekor. Pastikan backend sudah menyala.");
    }
  };

  const handleCancelSave = () => {
    setShowModal(false);
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Rubik's OpenHouse Timer
          </h1>
          <p className="text-gray-400 text-lg">
            Tekan <kbd className="px-2 py-1 bg-gray-800 rounded-md font-mono text-sm border border-gray-700">Spasi</kbd> untuk mulai dan berhenti.
          </p>
        </div>

        <Timer onTimeRecorded={handleTimeRecorded} />
        
        <Leaderboard records={records} loading={loading} />

        {showModal && (
          <SaveModal 
            timeMs={currentTimeMs} 
            onSave={handleSaveRecord} 
            onCancel={handleCancelSave} 
          />
        )}
      </div>
    </main>
  );
}
