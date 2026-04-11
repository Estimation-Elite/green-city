"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    format,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns"
import { fr, type Locale } from "date-fns/locale"
import { cn } from "@repo/utils"

interface CustomCalendarProps {
    selected?: Date
    onSelect?: (date: Date | undefined) => void
    disabled?: (date: Date) => boolean
    locale?: Locale
    className?: string
}

export function CustomCalendar({
    selected,
    onSelect,
    disabled,
    locale = fr,
    className,
}: CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(selected || new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { locale })
    const endDate = endOfWeek(monthEnd, { locale })

    const dateFormat = "MMMM yyyy"
    const dayFormat = "d"

    const rows: Date[][] = []
    let days: Date[] = []
    let day = startDate

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            days.push(day)
            day = addDays(day, 1)
        }
        rows.push(days)
        days = []
    }

    const handlePreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const handleDateClick = (date: Date) => {
        if (disabled && disabled(date)) return
        onSelect?.(date)
    }

    return (
        <div className={cn("p-3", className)}>
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={handlePreviousMonth}
                    className="h-8 w-8 bg-transparent p-0 hover:bg-gray-100 rounded-full inline-flex items-center justify-center transition-colors"
                    aria-label="Mois précédent"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="text-sm font-semibold text-gray-900 capitalize">
                    {format(currentMonth, dateFormat, { locale })}
                </div>

                <button
                    onClick={handleNextMonth}
                    className="h-8 w-8 bg-transparent p-0 hover:bg-gray-100 rounded-full inline-flex items-center justify-center transition-colors"
                    aria-label="Mois suivant"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
                {["lu", "ma", "me", "je", "ve", "sa", "di"].map((day) => (
                    <div
                        key={day}
                        className="text-gray-500 text-xs font-normal text-center h-10 flex items-center justify-center"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1">
                {rows.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-0">
                        {week.map((day, dayIndex) => {
                            const isDisabled = disabled ? disabled(day) : false
                            const isSelected = selected ? isSameDay(day, selected) : false
                            const isCurrentMonth = isSameMonth(day, monthStart)
                            const isTodayDate = isToday(day)

                            return (
                                <button
                                    key={dayIndex}
                                    onClick={() => handleDateClick(day)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "h-10 w-10 p-0 font-normal rounded-full inline-flex items-center justify-center transition-colors",
                                        "hover:bg-brand-primary/10",
                                        isSelected && "bg-brand-primary/20 text-brand-primary font-semibold hover:bg-brand-primary/20",
                                        isTodayDate && !isSelected && "bg-brand-primary/20 text-brand-primary font-semibold",
                                        !isCurrentMonth && "text-gray-300 opacity-50",
                                        isDisabled && "text-gray-300 opacity-50 cursor-not-allowed hover:bg-transparent"
                                    )}
                                >
                                    {format(day, dayFormat)}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
