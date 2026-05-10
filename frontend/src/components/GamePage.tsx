"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Timer, { TimerRef } from "@/components/Timer";
import Leaderboard, { RecordData } from "@/components/Leaderboard";
import SaveModal from "@/components/SaveModal";

const BASE_URL = "http://localhost:5000";

interface GamePageProps {
  title: string;
  subtitle: string;
  apiPath: string; // e.g. "/api/binary-records"
  timeLimitMs?: number;
}

export default function GamePage({ title, subtitle, apiPath, timeLimitMs }: GamePageProps) {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<TimerRef>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${apiPath}`);
      setRecords(response.data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [apiPath]);

  const handleTimeRecorded = (timeMs: number) => {
    setCurrentTimeMs(timeMs);
    setShowModal(true);
  };

  const handleSaveRecord = async (name: string) => {
    try {
      await axios.post(`${BASE_URL}${apiPath}`, {
        participant_name: name,
        time_ms: currentTimeMs,
      });
      setShowModal(false);
      fetchRecords();
    } catch (error) {
      console.error("Failed to save record", error);
      alert("Gagal menyimpan rekor. Pastikan backend sudah menyala.");
    }
  };

  const handleCancelSave = () => {
    setShowModal(false);
    timerRef.current?.resume();
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {title}
          </h1>
          <p className="text-gray-400 text-base">{subtitle}</p>
          {timeLimitMs && (
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
              Batas Waktu: {timeLimitMs / 60000 >= 1 ? `${timeLimitMs / 60000} Menit` : `${timeLimitMs / 1000} Detik`}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            Tekan{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded-md font-mono text-xs border border-gray-700">
              Spasi
            </kbd>{" "}
            untuk mulai dan berhenti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="order-1">
            <Timer
              ref={timerRef}
              onTimeRecorded={handleTimeRecorded}
              disabled={showModal}
              timeLimitMs={timeLimitMs}
            />
          </div>
          <div className="order-2 w-full">
            <Leaderboard records={records} loading={loading} />
          </div>
        </div>
      </div>

      {showModal && (
        <SaveModal
          timeMs={currentTimeMs}
          onSave={handleSaveRecord}
          onCancel={handleCancelSave}
        />
      )}
    </main>
  );
}
