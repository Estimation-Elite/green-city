import * as React from "react"
import {
    Train,
    Building2,
    Store,
    GraduationCap,
    TreePine,
    Hospital,
    UtensilsCrossed,
    Dumbbell,
    Clock,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@repo/utils"

type ProximityItem = {
    name: string
    duration: string
    iconColor?: string
}

type LandingProximityProps = {
    sectionTitle?: string
    items: ProximityItem[]
    className?: string
}

const ICON_MAP: LucideIcon[] = [
    Train,
    Building2,
    Store,
    GraduationCap,
    TreePine,
    Hospital,
    UtensilsCrossed,
    Dumbbell,
]

const COLOR_MAP: string[] = [
    "text-blue-500",
    "text-green-600",
    "text-purple-500",
    "text-orange-500",
    "text-green-500",
    "text-red-500",
    "text-amber-500",
    "text-blue-600",
]

const BG_COLOR_MAP: string[] = [
    "bg-blue-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-red-50",
    "bg-amber-50",
    "bg-blue-50",
]

function LandingProximity({
    sectionTitle = "Tout \u00e0 proximit\u00e9",
    items,
    className,
}: LandingProximityProps) {
    return (
        <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {sectionTitle}
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                    {items.map((item, index) => {
                        const Icon = ICON_MAP[index % ICON_MAP.length]!
                        const iconColor = item.iconColor ?? COLOR_MAP[index % COLOR_MAP.length]
                        const bgColor = BG_COLOR_MAP[index % BG_COLOR_MAP.length]

                        return (
                            <div
                                key={`${item.name}-${index}`}
                                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div
                                    className={cn(
                                        "flex size-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
                                        bgColor
                                    )}
                                >
                                    <Icon className={cn("size-6", iconColor)} />
                                </div>

                                <span className="text-sm font-semibold text-gray-800">
                                    {item.name}
                                </span>

                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Clock className="size-3.5" />
                                    <span>{item.duration}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export { LandingProximity, type LandingProximityProps, type ProximityItem }
