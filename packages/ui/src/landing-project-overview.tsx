import * as React from "react"
import {
    Building2,
    TreePine,
    Car,
    Sun,
    Home,
    Layers,
    Eye,
    MapPin,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@repo/utils"
import { Button } from "./button"

type OverviewFeature = {
    label: string
}

type OverviewTab = {
    label: string
    icon?: string
}

type LandingProjectOverviewProps = {
    sectionTitle: string
    subtitle?: string
    imageSrc: string
    imageAlt?: string
    features?: OverviewFeature[]
    tabs?: OverviewTab[]
    ctaLabel?: string
    ctaHref?: string
    className?: string
}

const TAB_ICON_MAP: Record<string, LucideIcon> = {
    building: Building2,
    tree: TreePine,
    car: Car,
    sun: Sun,
    home: Home,
    layers: Layers,
    eye: Eye,
    map: MapPin,
}

function LandingProjectOverview({
    sectionTitle,
    subtitle,
    imageSrc,
    imageAlt = "Vue 3D du projet",
    features = [],
    tabs = [],
    ctaLabel,
    ctaHref,
    className,
}: LandingProjectOverviewProps) {
    return (
        <section className={cn("overflow-hidden", className)}>
            {/* Green header bar */}
            <div className="bg-brand-primary px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                        {sectionTitle}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-base text-white/80 sm:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Full-width image */}
            <div className="relative w-full">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="h-auto w-full object-cover"
                />
            </div>

            {/* Feature labels */}
            {features.length > 0 && (
                <div className="bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-wrap justify-center gap-3">
                            {features.map((feature, index) => (
                                <span
                                    key={`${feature.label}-${index}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white px-4 py-2 text-sm font-medium text-brand-primary shadow-sm"
                                >
                                    <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                                        {index + 1}
                                    </span>
                                    {feature.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom navigation tabs */}
            {tabs.length > 0 && (
                <div className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex items-center justify-center gap-1 overflow-x-auto py-3 sm:gap-2">
                            {tabs.map((tab, index) => {
                                const iconKey = tab.icon?.toLowerCase() ?? ""
                                const Icon = TAB_ICON_MAP[iconKey] ?? Layers
                                return (
                                    <button
                                        key={`${tab.label}-${index}`}
                                        type="button"
                                        className="flex flex-shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary sm:px-4 sm:py-3"
                                    >
                                        <Icon className="size-5 sm:size-6" />
                                        <span className="text-[11px] font-medium sm:text-xs">
                                            {tab.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA button */}
            {ctaLabel && (
                <div className="flex justify-center bg-white px-4 pb-8 pt-2 sm:px-6 lg:px-8">
                    {ctaHref ? (
                        <Button asChild size="lg">
                            <a href={ctaHref}>{ctaLabel}</a>
                        </Button>
                    ) : (
                        <Button size="lg">{ctaLabel}</Button>
                    )}
                </div>
            )}
        </section>
    )
}

export {
    LandingProjectOverview,
    type LandingProjectOverviewProps,
    type OverviewFeature,
    type OverviewTab,
}
