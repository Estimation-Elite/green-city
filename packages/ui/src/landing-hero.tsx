"use client"

import * as React from "react"
import { MapPin, Star } from "lucide-react"
import { cn } from "@repo/utils"
import { motion } from "framer-motion"
import { Button } from "./button"
import { CountdownTimer } from "./countdown-timer"

type HeroStat = {
    value: string
    label: string
}

type HeroCta = {
    label: string
    href: string
}

type HeroCountdown = {
    targetDate: string
    label: string
}

type HeroTrustpilot = {
    rating: number
    reviewCount: number
    label?: string
}

type LandingHeroProps = {
    backgroundImageSrc: string
    projectLogoSrc?: string
    partnerLogoSrc?: string
    headline: string
    highlightedText?: string
    subtitle?: string
    stats?: HeroStat[]
    countdown?: HeroCountdown
    trustpilot?: HeroTrustpilot
    primaryCta: HeroCta
    secondaryCta?: HeroCta
    locationBadge?: string
    onPrimaryCtaClick?: () => void
    className?: string
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
    }),
}

function renderHeadline(headline: string, highlightedText?: string) {
    if (!highlightedText) return headline
    const parts = headline.split(highlightedText)
    if (parts.length === 1) return headline
    return (
        <>
            {parts[0]}
            <span className="text-amber-400">{highlightedText}</span>
            {parts.slice(1).join(highlightedText)}
        </>
    )
}

function TrustpilotBadge({ rating, reviewCount, label }: HeroTrustpilot) {
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5

    return (
        <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "size-4 sm:size-5",
                            i < fullStars
                                ? "fill-emerald-400 text-emerald-400"
                                : i === fullStars && hasHalf
                                  ? "fill-emerald-400/50 text-emerald-400"
                                  : "fill-white/20 text-white/20"
                        )}
                    />
                ))}
            </div>
            <span className="text-xs text-white/70 sm:text-sm">
                {rating.toFixed(1)}/5 — {reviewCount.toLocaleString("fr-FR")} avis
                {label && <> &middot; {label}</>}
            </span>
        </div>
    )
}

function LandingHero({
    backgroundImageSrc,
    projectLogoSrc,
    partnerLogoSrc,
    headline,
    highlightedText,
    subtitle,
    stats,
    countdown,
    trustpilot,
    primaryCta,
    secondaryCta,
    locationBadge,
    onPrimaryCtaClick,
    className,
}: LandingHeroProps) {
    return (
        <section
            className={cn(
                "relative flex min-h-screen items-center justify-center overflow-hidden",
                className
            )}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImageSrc})` }}
            />

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
                {/* Logos */}
                {(projectLogoSrc || partnerLogoSrc) && (
                    <motion.div
                        className="mb-8 flex items-center gap-4"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        {projectLogoSrc && (
                            <img
                                src={projectLogoSrc}
                                alt="Projet"
                                className="h-10 w-auto sm:h-14"
                            />
                        )}
                        {projectLogoSrc && partnerLogoSrc && (
                            <span className="h-8 w-px bg-white/30" />
                        )}
                        {partnerLogoSrc && (
                            <img
                                src={partnerLogoSrc}
                                alt="Partenaire"
                                className="h-8 w-auto sm:h-12"
                            />
                        )}
                    </motion.div>
                )}

                {/* Location badge */}
                {locationBadge && (
                    <motion.div
                        className="mb-4"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                            <MapPin className="size-4" />
                            {locationBadge}
                        </span>
                    </motion.div>
                )}

                {/* Headline */}
                <motion.h1
                    className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                >
                    {renderHeadline(headline, highlightedText)}
                </motion.h1>

                {/* Subtitle */}
                {subtitle && (
                    <motion.p
                        className="mb-8 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                    >
                        {subtitle}
                    </motion.p>
                )}

                {/* Stats */}
                {stats && stats.length > 0 && (
                    <motion.div
                        className="mb-8 flex flex-wrap items-center justify-center gap-3"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                    >
                        {stats.map((stat) => (
                            <span
                                key={stat.label}
                                className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-300 backdrop-blur-sm sm:text-base"
                            >
                                <span className="font-bold text-amber-400">
                                    {stat.value}
                                </span>
                                {stat.label}
                            </span>
                        ))}
                    </motion.div>
                )}

                {/* Countdown */}
                {countdown && (
                    <motion.div
                        className="mb-8"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                    >
                        <CountdownTimer
                            targetDate={countdown.targetDate}
                            label={countdown.label}
                        />
                    </motion.div>
                )}

                {/* CTA buttons */}
                <motion.div
                    className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={6}
                >
                    {onPrimaryCtaClick ? (
                        <Button size="xl" onClick={onPrimaryCtaClick}>
                            {primaryCta.label}
                        </Button>
                    ) : (
                        <Button asChild size="xl">
                            <a href={primaryCta.href}>{primaryCta.label}</a>
                        </Button>
                    )}
                    {secondaryCta && (
                        <Button
                            asChild
                            variant="outline"
                            size="xl"
                            className="border-white/30 bg-transparent text-white hover:bg-white/10"
                        >
                            <a href={secondaryCta.href}>{secondaryCta.label}</a>
                        </Button>
                    )}
                </motion.div>

                {/* Trustpilot */}
                {trustpilot && (
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={7}
                    >
                        <TrustpilotBadge {...trustpilot} />
                    </motion.div>
                )}
            </div>
        </section>
    )
}

export {
    LandingHero,
    type LandingHeroProps,
    type HeroStat,
    type HeroCta,
    type HeroCountdown,
    type HeroTrustpilot,
}
