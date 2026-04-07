"use client";

import { Button } from "@repo/ui";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function MobileCtaBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sable/40 bg-blanc-casse/95 backdrop-blur md:hidden">
      <div className="mx-auto px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <Button
          onClick={scrollToContact}
          className="h-11 w-full cursor-pointer rounded-full bg-sauge text-sm font-semibold text-white shadow-md transition hover:bg-sauge-dark"
        >
          Recevoir la plaquette
        </Button>
      </div>
    </div>
  );
}
