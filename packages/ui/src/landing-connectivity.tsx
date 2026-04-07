import * as React from "react"
import { Bus, Car, ShoppingBag, Sparkles } from "lucide-react"
import { cn } from "@repo/utils"
import { Button } from "./button"

type TransportOption = {
    title: string
    description: string
}

type FinancingOption = {
    title: string
    description: string
}

type LandingConnectivityProps = {
    sectionTitle?: string
    transportOptions: TransportOption[]
    ctaTitle?: string
    ctaSubtitle?: string
    partnerLogoSrc?: string
    financingOptions?: FinancingOption[]
    className?: string
}

const TRANSPORT_ICONS = [Bus, Car, ShoppingBag]

function LandingConnectivity({
    sectionTitle = "Connectivité",
    transportOptions,
    ctaTitle = "Saisissez l'opportunité",
    ctaSubtitle,
    partnerLogoSrc,
    financingOptions = [],
    className,
}: LandingConnectivityProps) {
    return (
        <section className={cn("overflow-hidden", className)}>
            {/* Dark green transport bar */}
            <div className="bg-brand-primary px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                        {sectionTitle}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {transportOptions.map((option, index) => {
                            const Icon = TRANSPORT_ICONS[index % TRANSPORT_ICONS.length]!
                            return (
                                <div
                                    key={`${option.title}-${index}`}
                                    className="flex flex-col items-center gap-3 rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/15"
                                >
                                    <div className="flex size-14 items-center justify-center rounded-full bg-white/20">
                                        <Icon className="size-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {option.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/75">
                                        {option.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Golden/amber CTA section */}
            <div className="bg-gradient-to-br from-amber-50 via-amber-100/60 to-yellow-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-accent/10 px-4 py-1.5">
                        <Sparkles className="size-4 text-brand-accent" />
                        <span className="text-sm font-semibold text-brand-accent">
                            Offre exclusive
                        </span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {ctaTitle}
                    </h2>

                    {ctaSubtitle && (
                        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg">
                            {ctaSubtitle}
                        </p>
                    )}

                    {partnerLogoSrc && (
                        <div className="mb-8 flex justify-center">
                            <img
                                src={partnerLogoSrc}
                                alt="Partenaire"
                                className="h-12 w-auto opacity-80"
                            />
                        </div>
                    )}

                    <Button size="xl" className="shadow-lg">
                        <a href="#contact">Contactez-nous</a>
                    </Button>
                </div>
            </div>

            {/* Financing options row */}
            {financingOptions.length > 0 && (
                <div className="border-t border-gray-100 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {financingOptions.map((option, index) => (
                                <div
                                    key={`${option.title}-${index}`}
                                    className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-6 text-center transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-accent/10">
                                        <span className="text-lg font-bold text-brand-accent">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                                        {option.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-500">
                                        {option.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export {
    LandingConnectivity,
    type LandingConnectivityProps,
    type TransportOption,
    type FinancingOption,
}
