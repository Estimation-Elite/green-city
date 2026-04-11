"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { toast } from "sonner"
import { trackLeadSubmitted } from "@repo/core/analytics/trackLeadSubmitted"

type SituationOption = {
    value: string
    label: string
}

type LeadModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    modalTitle?: string
    modalSubtitle?: string
    situationOptions?: SituationOption[]
}

function LeadModal({
    open,
    onOpenChange,
    modalTitle = "Recevoir la brochure",
    modalSubtitle,
    situationOptions = [],
}: LeadModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            prenom: formData.get("prenom"),
            nom: formData.get("nom"),
            email: formData.get("email"),
            telephone: formData.get("telephone"),
            situation: formData.get("situation"),
        }

        try {
            const response = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (!response.ok) {
                throw new Error(
                    result.error || "Envoi impossible pour le moment.",
                )
            }
            if (result.leadId) {
                trackLeadSubmitted(result.leadId)
            }
            onOpenChange(false)
                ; (e.target as HTMLFormElement).reset()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue.",
                {
                    description: "Veuillez réessayer plus tard.",
                },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

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
                                className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                {/* Close button */}
                                <Dialog.Close asChild>
                                    <button
                                        className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                        aria-label="Fermer"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </Dialog.Close>

                                {/* Header */}
                                <div className="mb-6">
                                    <Dialog.Title className="text-xl font-bold text-gray-900 sm:text-2xl">
                                        {modalTitle}
                                    </Dialog.Title>
                                    {modalSubtitle && (
                                        <Dialog.Description className="mt-1.5 text-sm text-gray-500">
                                            {modalSubtitle}
                                        </Dialog.Description>
                                    )}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="modal-prenom">
                                                Prénom <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="modal-prenom"
                                                name="prenom"
                                                placeholder="Votre prénom"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="modal-nom">
                                                Nom <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="modal-nom"
                                                name="nom"
                                                placeholder="Votre nom"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="modal-email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="modal-email"
                                            name="email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="modal-telephone">
                                            Téléphone <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="modal-telephone"
                                            name="telephone"
                                            type="tel"
                                            placeholder="06 XX XX XX XX"
                                            required
                                        />
                                    </div>

                                    {situationOptions.length > 0 && (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="modal-situation">Votre projet</Label>
                                            <select
                                                id="modal-situation"
                                                name="situation"
                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                                            >
                                                <option value="">Sélectionnez votre projet</option>
                                                {situationOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Consent */}
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="modal-consent"
                                            name="consent"
                                            required
                                            className="mt-1 size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        />
                                        <Label
                                            htmlFor="modal-consent"
                                            className="text-xs leading-relaxed text-gray-500"
                                        >
                                            J&apos;accepte que mes données soient traitées dans le
                                            cadre de ma demande. Consultez notre politique de
                                            confidentialité pour en savoir plus.
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Envoi en cours...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="size-4" />
                                                Envoyer ma demande
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    )
}

export { LeadModal, type LeadModalProps, type SituationOption }
