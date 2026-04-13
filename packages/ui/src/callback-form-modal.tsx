"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CallbackForm } from "./callback-form";

interface CallbackFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residenceRef?: string;
}

function CallbackFormModal({
  open,
  onOpenChange,
  residenceRef,
}: CallbackFormModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 z-10"
                    aria-label="Fermer"
                  >
                    <X className="size-5" />
                  </button>
                </Dialog.Close>

                <div className="mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Échanger avec un conseiller
                  </Dialog.Title>
                  <Dialog.Description className="mt-1.5 text-sm text-gray-500">
                    Choisissez un créneau et un conseiller vous rappellera.
                  </Dialog.Description>
                </div>

                <CallbackForm residenceRef={residenceRef} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export { CallbackFormModal, type CallbackFormModalProps };
