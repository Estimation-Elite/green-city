"use client"

import * as React from "react"
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Calendar,
    Home,
    Send,
} from "lucide-react"
import { cn } from "@repo/utils"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { Button } from "./button"
import { toast } from "sonner"

type ContactInfo = {
    phone?: string
    email?: string
    officeAddress?: string
    whatsappUrl?: string
}

type PricingInfo = {
    lotsAvailable?: number
    startingPrice?: string
    monthlyPayment?: string
}

type SituationOption = {
    value: string
    label: string
}

type LandingContactProps = {
    sectionTitle?: string
    subtitle?: string
    contactInfo: ContactInfo
    pricingInfo?: PricingInfo
    situationOptions?: SituationOption[]
    className?: string
}

function LandingContact({
    sectionTitle = "Contactez-nous",
    subtitle,
    contactInfo,
    pricingInfo,
    situationOptions = [
        { value: "salarie", label: "Salari\u00e9(e)" },
        { value: "independant", label: "Ind\u00e9pendant(e)" },
        { value: "fonctionnaire", label: "Fonctionnaire" },
        { value: "retraite", label: "Retrait\u00e9(e)" },
        { value: "autre", label: "Autre" },
    ],
    className,
}: LandingContactProps) {
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
            message: formData.get("message"),
        }

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            toast.success("Message envoy\u00e9 avec succ\u00e8s !", {
                description:
                    "Notre \u00e9quipe vous contactera dans les plus brefs d\u00e9lais.",
            })
            ;(e.target as HTMLFormElement).reset()
        } catch {
            toast.error("Une erreur est survenue.", {
                description: "Veuillez r\u00e9essayer plus tard.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            id="contact"
            className={cn("py-16 px-4 sm:px-6 lg:px-8 bg-gray-50", className)}
        >
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {sectionTitle}
                    </h2>
                    {subtitle && (
                        <p className="mt-3 text-base text-gray-600 sm:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* LEFT: Contact form */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">
                                        Pr\u00e9nom <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="prenom"
                                        name="prenom"
                                        placeholder="Votre pr\u00e9nom"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nom">
                                        Nom <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nom"
                                        name="nom"
                                        placeholder="Votre nom"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="telephone">
                                    T\u00e9l\u00e9phone <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="telephone"
                                    name="telephone"
                                    type="tel"
                                    placeholder="+212 6XX XXX XXX"
                                    required
                                />
                            </div>

                            {/* Situation dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="situation">Situation professionnelle</Label>
                                <select
                                    id="situation"
                                    name="situation"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">S\u00e9lectionnez votre situation</option>
                                    {situationOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="D\u00e9crivez votre projet ou posez vos questions..."
                                    rows={4}
                                />
                            </div>

                            {/* Consent checkbox */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    name="consent"
                                    required
                                    className="mt-1 size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <Label
                                    htmlFor="consent"
                                    className="text-xs leading-relaxed text-gray-500"
                                >
                                    J&apos;accepte que mes donn\u00e9es soient trait\u00e9es dans le
                                    cadre de ma demande de contact. Consultez notre politique de
                                    confidentialit\u00e9 pour en savoir plus.
                                </Label>
                            </div>

                            {/* Submit */}
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
                    </div>

                    {/* RIGHT: Contact info + pricing sidebar */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* Contact info cards */}
                        <div className="space-y-3">
                            {contactInfo.phone && (
                                <a
                                    href={`tel:${contactInfo.phone}`}
                                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                                        <Phone className="size-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            T\u00e9l\u00e9phone
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {contactInfo.phone}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {contactInfo.email && (
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                                        <Mail className="size-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Email
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {contactInfo.email}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {contactInfo.officeAddress && (
                                <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-50">
                                        <MapPin className="size-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Bureau de vente
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {contactInfo.officeAddress}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp button */}
                        {contactInfo.whatsappUrl && (
                            <a
                                href={contactInfo.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20BD5A] hover:shadow-lg"
                            >
                                <MessageCircle className="size-5" />
                                Discuter sur WhatsApp
                            </a>
                        )}

                        {/* Pricing / availability card */}
                        {pricingInfo && (
                            <div className="rounded-xl border border-brand-accent/20 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
                                <h3 className="mb-4 text-base font-bold text-gray-900">
                                    Informations tarifaires
                                </h3>
                                <div className="space-y-3">
                                    {pricingInfo.lotsAvailable !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Lots disponibles
                                            </span>
                                            <span className="rounded-full bg-brand-accent/10 px-3 py-0.5 text-sm font-bold text-brand-accent">
                                                {pricingInfo.lotsAvailable}
                                            </span>
                                        </div>
                                    )}
                                    {pricingInfo.startingPrice && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                \u00c0 partir de
                                            </span>
                                            <span className="text-lg font-extrabold text-brand-primary">
                                                {pricingInfo.startingPrice}
                                            </span>
                                        </div>
                                    )}
                                    {pricingInfo.monthlyPayment && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Mensualit\u00e9 \u00e0 partir de
                                            </span>
                                            <span className="text-base font-bold text-gray-900">
                                                {pricingInfo.monthlyPayment}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Schedule visit CTA */}
                        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-brand-primary/10">
                                <Calendar className="size-6 text-brand-primary" />
                            </div>
                            <h3 className="mb-1 text-base font-bold text-gray-900">
                                Programmez votre visite
                            </h3>
                            <p className="mb-4 text-sm text-gray-500">
                                D\u00e9couvrez le projet sur place avec nos conseillers
                            </p>
                            <Button variant="primary" size="default" className="w-full">
                                <Home className="size-4" />
                                R\u00e9server une visite
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export {
    LandingContact,
    type LandingContactProps,
    type ContactInfo,
    type PricingInfo,
    type SituationOption,
}
