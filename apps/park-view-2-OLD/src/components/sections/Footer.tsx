"use client";

import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sable/30 bg-sauge-very-dark py-10 text-white/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sable" />
            <span className="text-base font-semibold text-white">
              Park View 2
            </span>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-white/60">
            Park View 2 — Toulouse Empalot. Programme réalisé par Sporting
            Promotion et GreenCity Immobilier. Illustrations non contractuelles.
            RCS 485327084.
          </p>

          <p className="text-sm text-white/50">
            Rue Hubertine Auclert, 31400 Toulouse
          </p>

          <div className="mt-2 flex items-center gap-4 text-xs text-white/40">
            <a
              href="/mentions-legales"
              className="transition hover:text-white/70"
            >
              Mentions légales
            </a>
            <span>·</span>
            <button
              type="button"
              className="cursor-pointer transition hover:text-white/70"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-cookie-banner"));
                }
              }}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
