import * as React from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import { cn } from "@repo/utils"

type LegalLink = {
    label: string
    href: string
}

type FooterProps = {
    projectName: string
    developerName?: string
    logoSrc?: string
    phone?: string
    email?: string
    address?: string
    legalLinks?: LegalLink[]
    className?: string
}

function Footer({
    projectName,
    developerName,
    logoSrc,
    phone,
    email,
    address,
    legalLinks = [],
    className,
}: FooterProps) {
    const currentYear = new Date().getFullYear()

    return (
        <footer
            className={cn(
                "bg-brand-primary text-white",
                className
            )}
        >
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {/* Brand column */}
                    <div className="space-y-4">
                        {logoSrc && (
                            <img
                                src={logoSrc}
                                alt={projectName}
                                className="h-10 w-auto brightness-0 invert"
                            />
                        )}
                        <h3 className="text-xl font-bold">{projectName}</h3>
                        {developerName && (
                            <p className="text-sm text-white/70">
                                Un projet développé par{" "}
                                <span className="font-semibold text-white/90">
                                    {developerName}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Contact column */}
                    {phone || email || address ? (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                                Contact
                            </h4>
                            <div className="space-y-3">
                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
                                    >
                                        <Phone className="size-4 flex-shrink-0" />
                                        <span>{phone}</span>
                                    </a>
                                )}
                                {email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
                                    >
                                        <Mail className="size-4 flex-shrink-0" />
                                        <span>{email}</span>
                                    </a>
                                )}
                                {address && (
                                    <div className="flex items-start gap-3 text-sm text-white/80">
                                        <MapPin className="mt-0.5 size-4 flex-shrink-0" />
                                        <span>{address}</span>
                                    </div>
                                )}
                            </div>
                        </div>) : null}

                    {/* Legal links column */}
                    {legalLinks.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                                Informations légales
                            </h4>
                            <div className="space-y-2">
                                {legalLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="block text-sm text-white/70 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
                    {/* Legal links inline for mobile */}
                    {legalLinks.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 sm:hidden">
                            {legalLinks.map((link) => (
                                <a
                                    key={`mobile-${link.href}`}
                                    href={link.href}
                                    className="text-xs text-white/50 transition-colors hover:text-white/70"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-white/50">
                        &copy; {currentYear} {projectName}
                        {developerName ? ` - ${developerName}` : ""}. Tous droits
                        réservés.
                    </p>

                    <p className="text-xs text-white/40">
                        Illustrations non contractuelles
                    </p>
                </div>
            </div>
        </footer>
    )
}

export { Footer, type FooterProps, type LegalLink }
