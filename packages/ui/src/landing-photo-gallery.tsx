"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@repo/utils"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
} from "./carousel"

interface Photo {
    src: string
    alt: string
    tag?: string
    title?: string
    description?: string
}

interface LandingPhotoGalleryProps {
    sectionLabel?: string
    sectionTitle: string
    highlightedTitle?: string
    subtitle?: string
    photos: Photo[]
    className?: string
}

function LandingPhotoGallery({
    sectionLabel,
    sectionTitle,
    highlightedTitle,
    subtitle,
    photos,
    className,
}: LandingPhotoGalleryProps) {
    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

                {/* Photo Carousel */}
                <Carousel opts={{ loop: true }}>
                    <div className="relative">
                        <CarouselContent>
                            {photos.map((photo, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                                            priority={index === 0}
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Tag Badge */}
                                        {photo.tag && (
                                            <span className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                {photo.tag}
                                            </span>
                                        )}

                                        {/* Title + Description Overlay */}
                                        {(photo.title || photo.description) && (
                                            <div
                                                className={cn(
                                                    "absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-sm text-right",
                                                    photo.tag ? "left-36 sm:left-44" : "left-4 sm:left-6"
                                                )}
                                            >
                                                {photo.title && (
                                                    <h3 className="text-lg font-bold text-white sm:text-xl drop-shadow-md">
                                                        {photo.title}
                                                    </h3>
                                                )}
                                                {photo.description && (
                                                    <p className="mt-1 text-sm text-white/85 line-clamp-2 drop-shadow-md">
                                                        {photo.description}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <CarouselPrevious className="left-3 sm:left-5" />
                        <CarouselNext className="right-3 sm:right-5" />
                    </div>

                    {/* Dot Indicators */}
                    <CarouselDots className="mt-6" />
                </Carousel>
            </div>
        </section>
    )
}

export { LandingPhotoGallery, type LandingPhotoGalleryProps, type Photo }
