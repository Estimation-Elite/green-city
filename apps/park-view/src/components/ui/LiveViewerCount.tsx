"use client";

import { useSyncExternalStore } from "react";
import { Eye } from "lucide-react";

const MIN = 8;
const MAX = 23;
const UPDATE_MIN_MS = 3000;
const UPDATE_MAX_MS = 10000;

let currentCount = 0;
const listeners = new Set<() => void>();
let timerId: ReturnType<typeof setTimeout> | null = null;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scheduleNext() {
  const delay = randomInt(UPDATE_MIN_MS, UPDATE_MAX_MS);
  timerId = setTimeout(() => {
    const delta = randomInt(-2, 3);
    currentCount = Math.min(MAX, Math.max(MIN, currentCount + delta));
    listeners.forEach((l) => l());
    scheduleNext();
  }, delay);
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    currentCount = randomInt(MIN, MAX);
    scheduleNext();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}

function getSnapshot() {
  return currentCount;
}

function getServerSnapshot() {
  return 0;
}

interface LiveViewerCountProps {
  variant?: "dark" | "light";
  className?: string;
}

export function LiveViewerCount({
  variant = "dark",
  className = "",
}: LiveViewerCountProps) {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (count === 0) return null;

  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${isDark
        ? "bg-white/10 border border-white/20 text-white"
        : "bg-dark/5 border border-dark/10 text-foreground"
        } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <Eye className="w-4 h-4 opacity-70" />
      <span>
        <strong>{count}</strong> personnes regardent cette page
      </span>
    </div>
  );
}
