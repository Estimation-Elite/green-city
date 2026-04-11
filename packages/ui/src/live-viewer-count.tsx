"use client";

import { useSyncExternalStore } from "react";
import { Eye } from "lucide-react";

interface LiveViewerCountConfig {
  min: number;
  max: number;
  updateMinMs: number;
  updateMaxMs: number;
  incrementMin: number;
  incrementMax: number;
}

const DEFAULT_CONFIG: LiveViewerCountConfig = {
  min: 8,
  max: 23,
  updateMinMs: 5000,
  updateMaxMs: 15000,
  incrementMin: -2,
  incrementMax: 3,
};

const FAST_CONFIG: LiveViewerCountConfig = {
  min: 12,
  max: 35,
  updateMinMs: 2000,
  updateMaxMs: 4000,
  incrementMin: 1,
  incrementMax: 3,
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCounterStore(config: LiveViewerCountConfig) {
  let currentCount = 0;
  const listeners = new Set<() => void>();
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function scheduleNext() {
    const delay = randomInt(config.updateMinMs, config.updateMaxMs);
    timerId = setTimeout(() => {
      const delta = randomInt(config.incrementMin, config.incrementMax);
      currentCount = Math.min(config.max, Math.max(config.min, currentCount + delta));
      listeners.forEach((l) => l());
      scheduleNext();
    }, delay);
  }

  function subscribe(listener: () => void) {
    if (listeners.size === 0) {
      currentCount = randomInt(config.min, config.max);
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

  return { subscribe, getSnapshot, getServerSnapshot };
}

const stores = new Map<string, ReturnType<typeof createCounterStore>>();

function getStore(config: LiveViewerCountConfig) {
  const key = JSON.stringify(config);
  if (!stores.has(key)) {
    stores.set(key, createCounterStore(config));
  }
  return stores.get(key)!;
}

interface LiveViewerCountProps {
  variant?: "dark" | "light";
  speed?: "default" | "fast";
  className?: string;
}

function LiveViewerCount({
  variant = "dark",
  speed = "default",
  className = "",
}: LiveViewerCountProps) {
  const config = speed === "fast" ? FAST_CONFIG : DEFAULT_CONFIG;
  const store = getStore(config);
  const count = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  if (count === 0) return null;

  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
        isDark
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

export { LiveViewerCount, type LiveViewerCountProps, FAST_CONFIG, DEFAULT_CONFIG };
