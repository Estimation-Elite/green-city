"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@repo/utils"
import { Button } from "./button"

type NavLink = {
    label: string
    href: string
}

type HeaderProps = {
    projectLogoSrc: string
    projectLogoAlt?: string
    partnerLogoSrc?: string
    partnerLogoAlt?: string
    navLinks?: NavLink[]
    ctaLabel?: string
    ctaHref?: string
    className?: string
}

function Header({
    projectLogoSrc,
    projectLogoAlt = "Logo",
    partnerLogoSrc,
    partnerLogoAlt = "Partenaire",
    navLinks = [],
    ctaLabel,
    ctaHref,
    className,
}: HeaderProps) {
    const [scrolled, setScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    React.useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [mobileMenuOpen])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm"
                    : "bg-transparent",
                className
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: logos */}
                <div className="flex items-center gap-4">
                    <a href="/" className="flex-shrink-0">
                        <img
                            src={projectLogoSrc}
                            alt={projectLogoAlt}
                            className="h-8 w-auto sm:h-10"
                        />
                    </a>
                    {partnerLogoSrc && (
                        <>
                            <span
                                className={cn(
                                    "h-6 w-px",
                                    scrolled ? "bg-gray-300" : "bg-white/40"
                                )}
                            />
                            <img
                                src={partnerLogoSrc}
                                alt={partnerLogoAlt}
                                className="h-6 w-auto sm:h-8"
                            />
                        </>
                    )}
                </div>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:opacity-80",
                                scrolled ? "text-gray-700" : "text-white"
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                    {ctaLabel && ctaHref && (
                        <Button asChild size="sm">
                            <a href={ctaHref}>{ctaLabel}</a>
                        </Button>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className={cn(
                        "inline-flex items-center justify-center rounded-md p-2 md:hidden",
                        scrolled
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-white hover:bg-white/10"
                    )}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {mobileMenuOpen ? (
                        <X className="size-6" />
                    ) : (
                        <Menu className="size-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-white md:hidden">
                    <nav className="flex flex-col gap-1 px-4 py-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        {ctaLabel && ctaHref && (
                            <div className="mt-4 px-4">
                                <Button asChild size="lg" className="w-full">
                                    <a href={ctaHref}>{ctaLabel}</a>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

export { Header, type HeaderProps, type NavLink }
