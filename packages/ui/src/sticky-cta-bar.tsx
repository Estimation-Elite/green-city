"use client";

import { useState } from "react";
import { Download, Phone } from "lucide-react";
import { LiveViewerCount } from "./live-viewer-count";
import { BrochureFormModal } from "./brochure-form-modal";
import { CallbackFormModal } from "./callback-form-modal";

interface StickyCtaBarProps {
  pdfUrl: string;
  pdfFilename: string;
  residenceId?: string;
}

function StickyCtaBar({
  pdfUrl,
  pdfFilename,
  residenceId,
}: StickyCtaBarProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

  const anyModalOpen = brochureOpen || callbackOpen;

  return (
    <>
      {/* Sticky bar */}
      {!anyModalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between py-3">
              <button
                onClick={() => setBrochureOpen(true)}
                className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Télécharger la brochure
              </button>

              <LiveViewerCount variant="light" speed="fast" />

              <button
                onClick={() => setCallbackOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Échanger avec un conseiller
              </button>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden py-3 space-y-2">
              <LiveViewerCount variant="light" speed="fast" className="w-full justify-center" />
              <div className="flex gap-2">
                <button
                  onClick={() => setBrochureOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-3 rounded-lg transition text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Brochure
                </button>
                <button
                  onClick={() => setCallbackOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-3 rounded-lg transition text-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Être rappelé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <BrochureFormModal
        open={brochureOpen}
        onOpenChange={setBrochureOpen}
        pdfUrl={pdfUrl}
        pdfFilename={pdfFilename}
        residenceId={residenceId}
      />
      <CallbackFormModal
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        residenceId={residenceId}
      />
    </>
  );
}

export { StickyCtaBar, type StickyCtaBarProps };
