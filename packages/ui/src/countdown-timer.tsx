"use client"

import * as React from "react"
import { cn } from "@repo/utils"

type CountdownTimerProps = {
    targetDate: string
    label: string
    className?: string
}

type TimeLeft = {
    days: number
    hours: number
    minutes: number
    seconds: number
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
    const difference = new Date(targetDate).getTime() - Date.now()
    if (difference <= 0) return null
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    }
}

function TimeBox({ value, unit }: { value: number; unit: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-400 text-2xl font-bold text-amber-950 shadow-md sm:h-16 sm:w-16 sm:text-3xl">
                {String(value).padStart(2, "0")}
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-amber-200/80 sm:text-sm">
                {unit}
            </span>
        </div>
    )
}

function CountdownTimer({ targetDate, label, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(() =>
        calculateTimeLeft(targetDate)
    )

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate))
        }, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    if (!timeLeft) {
        return (
            <div className={cn("text-center", className)}>
                <p className="rounded-lg bg-amber-400/20 px-6 py-3 text-base font-semibold text-amber-300">
                    Offre expir&eacute;e
                </p>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            {label && (
                <p className="text-sm font-medium text-white/80 sm:text-base">
                    {label}
                </p>
            )}
            <div className="flex items-center gap-3 sm:gap-4">
                <TimeBox value={timeLeft.days} unit="Jours" />
                <span className="mt-[-1.25rem] text-2xl font-bold text-amber-400/60">
                    :
                </span>
                <TimeBox value={timeLeft.hours} unit="Heures" />
                <span className="mt-[-1.25rem] text-2xl font-bold text-amber-400/60">
                    :
                </span>
                <TimeBox value={timeLeft.minutes} unit="Min" />
                <span className="mt-[-1.25rem] text-2xl font-bold text-amber-400/60">
                    :
                </span>
                <TimeBox value={timeLeft.seconds} unit="Sec" />
            </div>
        </div>
    )
}

export { CountdownTimer, type CountdownTimerProps }
