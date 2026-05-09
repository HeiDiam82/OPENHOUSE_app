"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type TimerState = "IDLE" | "RUNNING" | "STOPPED";

interface TimerProps {
  onTimeRecorded: (timeMs: number) => void;
}

export default function Timer({ onTimeRecorded }: TimerProps) {
  const [timerState, setTimerState] = useState<TimerState>("IDLE");
  const [timeMs, setTimeMs] = useState(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      setTimeMs(performance.now() - startTimeRef.current);
      requestRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();

        setTimerState((prev) => {
          if (prev === "IDLE") {
            // Start timer
            startTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(updateTime);
            return "RUNNING";
          } else if (prev === "RUNNING") {
            // Stop timer
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            const finalTime = performance.now() - (startTimeRef.current || 0);
            setTimeMs(finalTime);
            
            // Allow state update to finish before triggering callback
            setTimeout(() => {
                onTimeRecorded(Math.floor(finalTime));
            }, 0);
            
            return "STOPPED";
          }
          return prev;
        });
      }
    },
    [updateTime, onTimeRecorded]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetTimer = () => {
    setTimerState("IDLE");
    setTimeMs(0);
    startTimeRef.current = null;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes > 0 ? `${minutes}:` : ""}${
      seconds < 10 && minutes > 0 ? "0" : ""
    }${seconds}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
      <div
        className={`text-6xl md:text-8xl font-mono font-bold tracking-wider mb-8 transition-colors duration-300 ${
          timerState === "RUNNING" ? "text-green-400" : "text-white"
        }`}
      >
        {formatTime(timeMs)}
      </div>
      
      <p className="text-gray-400 mb-6 text-sm uppercase tracking-widest font-semibold">
        {timerState === "IDLE" && "Tekan SPASI untuk mulai"}
        {timerState === "RUNNING" && "Tekan SPASI untuk berhenti"}
        {timerState === "STOPPED" && "Timer dihentikan"}
      </p>

      {timerState === "STOPPED" && (
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg text-white font-medium"
        >
          Reset Timer (Tanpa Simpan)
        </button>
      )}
    </div>
  );
}
