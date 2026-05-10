"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

type TimerState = "IDLE" | "RUNNING" | "STOPPED" | "DISQUALIFIED";

interface TimerProps {
  onTimeRecorded: (timeMs: number) => void;
  onDisqualified?: () => void;
  disabled?: boolean;
  timeLimitMs?: number; // null/undefined = no limit (Rubik mode)
}

export interface TimerRef {
  resume: () => void;
}

const Timer = forwardRef<TimerRef, TimerProps>(
  ({ onTimeRecorded, onDisqualified, disabled, timeLimitMs }, ref) => {
    const [timerState, setTimerState] = useState<TimerState>("IDLE");
    const timerStateRef = useRef<TimerState>("IDLE");
    const [timeMs, setTimeMs] = useState(0);
    const finalTimeRef = useRef(0);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      resume: () => {
        if (timerStateRef.current === "STOPPED") {
          timerStateRef.current = "RUNNING";
          setTimerState("RUNNING");
          startTimeRef.current = performance.now() - finalTimeRef.current;
          requestRef.current = requestAnimationFrame(updateTime);
        }
      },
    }), []);

    const updateTime = useCallback(() => {
      if (startTimeRef.current !== null) {
        const elapsed = performance.now() - startTimeRef.current;

        // Check time limit → auto disqualify
        if (timeLimitMs && elapsed >= timeLimitMs) {
          setTimeMs(timeLimitMs);
          timerStateRef.current = "DISQUALIFIED";
          setTimerState("DISQUALIFIED");
          finalTimeRef.current = timeLimitMs;
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
          startTimeRef.current = null;
          if (onDisqualified) onDisqualified();
          return;
        }

        setTimeMs(elapsed);
        requestRef.current = requestAnimationFrame(updateTime);
      }
    }, [timeLimitMs, onDisqualified]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (
          disabled ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLButtonElement
        ) {
          return;
        }

        if (e.code === "Space") {
          e.preventDefault();

          if (timerStateRef.current === "IDLE") {
            timerStateRef.current = "RUNNING";
            setTimerState("RUNNING");
            startTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(updateTime);
          } else if (timerStateRef.current === "RUNNING") {
            timerStateRef.current = "STOPPED";
            setTimerState("STOPPED");
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            const finalTime = performance.now() - (startTimeRef.current || 0);
            finalTimeRef.current = finalTime;
            setTimeMs(finalTime);
            setTimeout(() => {
              onTimeRecorded(Math.floor(finalTime));
            }, 0);
          } else if (timerStateRef.current === "STOPPED") {
            timerStateRef.current = "RUNNING";
            setTimerState("RUNNING");
            startTimeRef.current = performance.now() - finalTimeRef.current;
            requestRef.current = requestAnimationFrame(updateTime);
          }
        }
      },
      [updateTime, onTimeRecorded, disabled]
    );

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const resetTimer = () => {
      timerStateRef.current = "IDLE";
      setTimerState("IDLE");
      setTimeMs(0);
      finalTimeRef.current = 0;
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

    const isDisqualified = timerState === "DISQUALIFIED";

    return (
      <div
        className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl border transition-colors duration-500 ${
          isDisqualified
            ? "bg-red-950 border-red-700"
            : "bg-gray-900 border-gray-800"
        }`}
      >
        {timeLimitMs && timerState === "RUNNING" && (
          <div className="w-full bg-gray-800 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all bg-green-500"
              style={{ width: `${Math.min((timeMs / timeLimitMs) * 100, 100)}%`,
                backgroundColor: timeMs / timeLimitMs > 0.75 ? '#ef4444' : timeMs / timeLimitMs > 0.5 ? '#f59e0b' : '#22c55e'
              }}
            />
          </div>
        )}

        <div
          className={`text-6xl md:text-8xl font-mono font-bold tracking-wider mb-8 transition-colors duration-300 ${
            isDisqualified
              ? "text-red-400"
              : timerState === "RUNNING"
              ? "text-green-400"
              : "text-white"
          }`}
        >
          {formatTime(timeMs)}
        </div>

        <p className={`mb-6 text-sm uppercase tracking-widest font-semibold ${isDisqualified ? "text-red-400" : "text-gray-400"}`}>
          {timerState === "IDLE" && "Tekan SPASI untuk mulai"}
          {timerState === "RUNNING" && "Tekan SPASI untuk berhenti"}
          {timerState === "STOPPED" && "Timer dihentikan — Tekan SPASI untuk lanjut"}
          {timerState === "DISQUALIFIED" && "⛔ GUGUR — WAKTU HABIS!"}
        </p>

        <button
          onClick={resetTimer}
          disabled={timerState === "IDLE"}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            timerState === "IDLE"
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Reset Timer
        </button>
      </div>
    );
  }
);

export default Timer;
