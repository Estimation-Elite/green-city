import * as React from "react"
import { MapPin } from "lucide-react"
import { cn } from "@repo/utils"

type DistanceStat = {
    value: string
    label: string
}

type LandingLocationMapProps = {
    sectionTitle: string
    subtitle?: string
    mapImageSrc: string
    mapImageAlt?: string
    distanceStats: DistanceStat[]
    projectBadge?: string
    className?: string
}

function LandingLocationMap({
    sectionTitle,
    subtitle,
    mapImageSrc,
    mapImageAlt = "Carte de localisation",
    distanceStats,
    projectBadge,
    className,
}: LandingLocationMapProps) {
    return (
        <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
            <div className="mx-auto max-w-6xl">
                {/* Title with pin icon and yellow accent */}
                <div className="mb-4 flex flex-col items-center text-center">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-brand-accent/10">
                            <MapPin className="size-5 text-brand-accent" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            {sectionTitle}
                        </h2>
                    </div>
                    <div className="mx-auto h-1 w-16 rounded-full bg-brand-accent" />
                </div>

                {/* Subtitle */}
                {subtitle && (
                    <p className="mx-auto mb-8 max-w-2xl text-center text-base text-gray-600 sm:text-lg">
                        {subtitle}
                    </p>
                )}

                {/* Map image */}
                <div className="relative mb-8 overflow-hidden rounded-2xl shadow-lg">
                    <img
                        src={mapImageSrc}
                        alt={mapImageAlt}
                        className="h-auto w-full object-cover"
                    />
                    {projectBadge && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-white shadow-lg">
                                <MapPin className="size-4" />
                                {projectBadge}
                            </div>
                        </div>
                    )}
                </div>

                {/* Distance stats */}
                {distanceStats.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {distanceStats.map((stat, index) => (
                            <div
                                key={`${stat.label}-${index}`}
                                className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
                            >
                                <span className="text-3xl font-extrabold text-brand-accent sm:text-4xl">
                                    {stat.value}
                                </span>
                                <span className="mt-2 text-sm font-medium text-gray-600">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export {
    LandingLocationMap,
    type LandingLocationMapProps,
    type DistanceStat,
}
