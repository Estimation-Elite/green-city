import * as React from "react"
import {
    Car,
    Trees,
    Bike,
    ShieldCheck,
    Zap,
    Leaf,
    Waves,
    Dumbbell,
    ParkingCircle,
    Baby,
    Dog,
    Wifi,
    Sun,
    Thermometer,
    Lock,
    Building2,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@repo/utils"
import { Button } from "./button"

const iconMap: Record<string, LucideIcon> = {
    car: Car,
    trees: Trees,
    bike: Bike,
    shield: ShieldCheck,
    zap: Zap,
    leaf: Leaf,
    waves: Waves,
    dumbbell: Dumbbell,
    parking: ParkingCircle,
    baby: Baby,
    dog: Dog,
    wifi: Wifi,
    sun: Sun,
    thermometer: Thermometer,
    lock: Lock,
    building: Building2,
}

type EquipmentItem = {
    icon: string
    label: string
    sublabel?: string
}

type CtaAction = {
    label: string
    href: string
    variant?: "default" | "primary" | "outline"
}

type CtaBanner = {
    message: string
    subtitle?: string
    actions: CtaAction[]
}

type LandingEquipmentProps = {
    sectionTitle: string
    items: EquipmentItem[]
    ctaBanner?: CtaBanner
    className?: string
}

function EquipmentIcon({ name }: { name: string }) {
    const Icon = iconMap[name.toLowerCase()] ?? Building2
    return <Icon className="size-7 text-emerald-600 sm:size-8" />
}

function LandingEquipment({
    sectionTitle,
    items,
    ctaBanner,
    className,
}: LandingEquipmentProps) {
    return (
        <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section title */}
                <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:mb-12 sm:text-3xl lg:text-4xl">
                    {sectionTitle}
                </h2>

                {/* Equipment grid */}
                <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-8">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:shadow-md sm:p-6"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                                <EquipmentIcon name={item.icon} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                    {item.label}
                                </p>
                                {item.sublabel && (
                                    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                                        {item.sublabel}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                {ctaBanner && (
                    <div className="overflow-hidden rounded-2xl bg-emerald-900 px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-16">
                        <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                            {ctaBanner.message}
                        </h3>
                        {ctaBanner.subtitle && (
                            <p className="mb-6 text-sm text-emerald-200 sm:text-base">
                                {ctaBanner.subtitle}
                            </p>
                        )}
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            {ctaBanner.actions.map((action) => (
                                <Button
                                    key={action.label}
                                    asChild
                                    size="lg"
                                    variant={action.variant ?? "default"}
                                    className={cn(
                                        action.variant === "outline"
                                            ? "border-white/30 bg-transparent text-white hover:bg-white/10"
                                            : ""
                                    )}
                                >
                                    <a href={action.href}>{action.label}</a>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export {
    LandingEquipment,
    type LandingEquipmentProps,
    type EquipmentItem,
    type CtaBanner,
    type CtaAction,
}
