"use client";

import * as React from "react";

/**
 * GDPR / CNIL-compliant cookie banner with Google Consent Mode v2 integration.
 *
 * Loaded on every public layout. On first visit, presents three explicit
 * choices (accept all / reject / customize) per CNIL guidelines. The user's
 * decision is persisted in a 12-month cookie and emitted to GTM's dataLayer
 * via gtag('consent', 'update', ...) so that downstream tags (GA4, Meta
 * Pixel, Google Ads) honour the choice via Consent Mode v2.
 *
 * The default consent state (all 'denied') is set by the inline script in
 * GTM.tsx before the GTM loader runs — this banner only updates it.
 */

const COOKIE_NAME = "gc_consent";
const COOKIE_VERSION = "1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

type ConsentChoices = {
  analytics_storage: boolean;
  ad_storage: boolean;
  ad_user_data: boolean;
  ad_personalization: boolean;
};

const ALL_ACCEPTED: ConsentChoices = {
  analytics_storage: true,
  ad_storage: true,
  ad_user_data: true,
  ad_personalization: true,
};

const ALL_REJECTED: ConsentChoices = {
  analytics_storage: false,
  ad_storage: false,
  ad_user_data: false,
  ad_personalization: false,
};

type StoredConsent = {
  version: string;
  timestamp: string;
  choices: ConsentChoices;
};

function readStoredConsent(): StoredConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const raw = decodeURIComponent(match.split("=")[1] ?? "");
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== COOKIE_VERSION) return null;
    if (!parsed.choices) return null;
    return parsed as StoredConsent;
  } catch {
    return null;
  }
}

function writeStoredConsent(choices: ConsentChoices) {
  const payload: StoredConsent = {
    version: COOKIE_VERSION,
    timestamp: new Date().toISOString(),
    choices,
  };
  const value = encodeURIComponent(JSON.stringify(payload));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function emitConsentUpdate(choices: ConsentChoices) {
  const w = window as unknown as {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  const update = {
    analytics_storage: choices.analytics_storage ? "granted" : "denied",
    ad_storage: choices.ad_storage ? "granted" : "denied",
    ad_user_data: choices.ad_user_data ? "granted" : "denied",
    ad_personalization: choices.ad_personalization ? "granted" : "denied",
  };
  // Push directly to dataLayer (gtag function may not be defined if GTM
  // didn't initialise — the default consent inline script defines it, but
  // we stay defensive here).
  w.dataLayer.push({ event: "consent_update", ...update });
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", update);
  }
}

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [showCustom, setShowCustom] = React.useState(false);
  const [draft, setDraft] = React.useState<ConsentChoices>(ALL_REJECTED);

  React.useEffect(() => {
    if (!readStoredConsent()) {
      setVisible(true);
    }
  }, []);

  React.useEffect(() => {
    function onOpenCustom() {
      const existing = readStoredConsent();
      setDraft(existing?.choices ?? ALL_REJECTED);
      setShowCustom(true);
      setVisible(true);
    }
    window.addEventListener("gc:open-cookie-settings", onOpenCustom);
    return () =>
      window.removeEventListener("gc:open-cookie-settings", onOpenCustom);
  }, []);

  const apply = (choices: ConsentChoices) => {
    writeStoredConsent(choices);
    emitConsentUpdate(choices);
    setVisible(false);
    setShowCustom(false);
  };

  if (!visible) return null;

  if (showCustom) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Gérer mes préférences cookies
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choisissez quelles catégories de cookies vous autorisez. Les
              cookies strictement nécessaires au fonctionnement du site sont
              toujours activés.
            </p>

            <div className="mt-5 space-y-4">
              <ConsentToggle
                title="Mesure d'audience"
                description="Statistiques anonymisées de fréquentation (Google Analytics)."
                checked={draft.analytics_storage}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, analytics_storage: v }))
                }
              />
              <ConsentToggle
                title="Publicité et marketing"
                description="Suivi des conversions et personnalisation des publicités (Meta Pixel, Google Ads)."
                checked={
                  draft.ad_storage &&
                  draft.ad_user_data &&
                  draft.ad_personalization
                }
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    ad_storage: v,
                    ad_user_data: v,
                    ad_personalization: v,
                  }))
                }
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => apply(ALL_REJECTED)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() => apply(ALL_ACCEPTED)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={() => apply(draft)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex-1">
            <h2 className="text-base font-bold text-gray-900">
              Votre vie privée
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Nous utilisons des cookies pour mesurer l&apos;audience du site
              et améliorer votre expérience. Vous pouvez accepter, refuser
              ou personnaliser à tout moment. En savoir plus dans notre{" "}
              <a href="/cookies" className="underline hover:text-gray-900">
                politique des cookies
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => apply(ALL_ACCEPTED)}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => apply(ALL_REJECTED)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(readStoredConsent()?.choices ?? ALL_REJECTED);
                setShowCustom(true);
              }}
              className="text-xs text-gray-500 underline hover:text-gray-700"
            >
              Personnaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ConsentToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ConsentToggle({
  title,
  description,
  checked,
  onChange,
}: ConsentToggleProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-3">
      <span className="flex-1">
        <span className="block text-sm font-semibold text-gray-900">
          {title}
        </span>
        <span className="block text-xs text-gray-500">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
      />
    </label>
  );
}
