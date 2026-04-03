import * as React from "react"
import { CircleCheck } from "lucide-react"
import { cn } from "@repo/utils"

type ValuePropositionItem = {
    title: string
    description: string
}

type LandingValuePropositionProps = {
    sectionLabel?: string
    sectionTitle: string
    highlightedTitle?: string
    subtitle?: string
    items: ValuePropositionItem[]
    className?: string
}

function renderTitle(sectionTitle: string, highlightedTitle?: string) {
    if (!highlightedTitle) return sectionTitle
    const parts = sectionTitle.split(highlightedTitle)
    if (parts.length === 1) return sectionTitle
    return (
        <>
            {parts[0]}
            <em className="not-italic text-brand-accent">{highlightedTitle}</em>
            {parts.slice(1).join(highlightedTitle)}
        </>
    )
}

function LandingValueProposition({
    sectionLabel,
    sectionTitle,
    highlightedTitle,
    subtitle,
    items,
    className,
}: LandingValuePropositionProps) {
    return (
        <section
            className={cn(
                "bg-white py-16 sm:py-20 lg:py-24",
                className
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
                    {sectionLabel && (
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-accent">
                            {sectionLabel}
                        </p>
                    )}
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        {renderTitle(sectionTitle, highlightedTitle)}
                    </h2>
                    {subtitle && (
                        <p className="text-base text-gray-600 sm:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                    {items.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md sm:p-8"
                        >
                            <div className="mb-4 flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                    <CircleCheck className="size-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export {
    LandingValueProposition,
    type LandingValuePropositionProps,
    type ValuePropositionItem,
}
