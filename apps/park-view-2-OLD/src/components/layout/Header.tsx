"use client";

import { Button } from "@repo/ui";
import { Building2 } from "lucide-react";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sable/40 bg-blanc-casse/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-sauge" />
          <span className="text-lg font-semibold text-sauge-dark">
            Park View 2
          </span>
        </div>
        <Button
          onClick={scrollToContact}
          className="hidden cursor-pointer rounded-full bg-sauge px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sauge-dark hover:scale-105 md:inline-flex"
        >
          Recevoir la plaquette
        </Button>
      </div>
    </header>
  );
}
