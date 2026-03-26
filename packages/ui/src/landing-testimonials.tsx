"use client"

import * as React from "react"
import { Star, Quote } from "lucide-react"
import { cn } from "@repo/utils"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "./carousel"

interface Testimonial {
    name: string
    role?: string
    quote: string
    rating?: number
}

interface Stat {
    value: string
    label: string
}

interface LandingTestimonialsProps {
    sectionLabel?: string
    sectionTitle: string
    highlightedTitle?: string
    subtitle?: string
    testimonials: Testimonial[]
    stats?: Stat[]
    className?: string
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "size-5",
                        i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                    )}
                />
            ))}
        </div>
    )
}

function LandingTestimonials({
    sectionLabel,
    sectionTitle,
    highlightedTitle,
    subtitle,
    testimonials,
    stats,
    className,
}: LandingTestimonialsProps) {
    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    {sectionLabel && (
                        <span className="inline-block text-sm font-semibold uppercase tracking-wider text-brand-accent mb-3">
                            {sectionLabel}
                        </span>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                        {sectionTitle}{" "}
                        {highlightedTitle && (
                            <span className="italic text-brand-accent">
                                {highlightedTitle}
                            </span>
                        )}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-3xl mx-auto">
                    <Carousel opts={{ loop: true }}>
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex flex-col items-center text-center px-4 sm:px-8 md:px-12">
                                        {/* Quote Icon */}
                                        <div className="mb-6">
                                            <Quote className="size-10 text-brand-accent/30 fill-brand-accent/10" />
                                        </div>

                                        {/* Quote Text */}
                                        <blockquote className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-700 font-medium mb-6">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </blockquote>

                                        {/* Star Rating */}
                                        {testimonial.rating != null && (
                                            <div className="mb-4">
                                                <StarRating rating={testimonial.rating} />
                                            </div>
                                        )}

                                        {/* Author */}
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-base font-semibold text-gray-900">
                                                {testimonial.name}
                                            </span>
                                            {testimonial.role && (
                                                <span className="text-sm text-gray-500">
                                                    {testimonial.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselDots className="mt-8" />
                    </Carousel>
                </div>

                {/* Stats Row */}
                {stats && stats.length > 0 && (
                    <div className="mt-16 md:mt-20 border-t border-gray-200 pt-12">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-3xl font-bold text-brand-accent sm:text-4xl">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-gray-600">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export { LandingTestimonials, type LandingTestimonialsProps, type Testimonial, type Stat }
