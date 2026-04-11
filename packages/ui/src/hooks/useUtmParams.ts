"use client";

import { useEffect, useState } from "react";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "utm_params";

function readStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storeUtm(params: UtmParams) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // silently ignore storage errors
  }
}

/**
 * Captures UTM parameters from the current URL and persists them
 * in sessionStorage so they survive in-app navigation.
 */
export function useUtmParams(): UtmParams {
  const [utm, setUtm] = useState<UtmParams>(readStoredUtm);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: UtmParams = {};
    let hasNew = false;

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        fromUrl[key] = value;
        hasNew = true;
      }
    }

    if (hasNew) {
      const merged = { ...readStoredUtm(), ...fromUrl };
      storeUtm(merged);
      setUtm(merged);
    }
  }, []);

  return utm;
}
