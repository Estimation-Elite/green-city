import * as React from "react"
import { Home, TreePine, Mountain, Eye } from "lucide-react"
import { cn } from "@repo/utils"
import { Button } from "./button"

const iconMap: Record<string, React.ElementType> = {
    Home,
    TreePine,
    Mountain,
}

interface Category {
    icon: string
    title: string
    description: string
}

interface ComingSoon {
    title: string
    description: string
    ctaLabel: string
    ctaHref?: string
}

interface LandingVirtualTourProps {
    sectionTitle: string
    subtitle?: string
    categories: Category[]
    comingSoon?: ComingSoon
    className?: string
}

function CategoryCard({ category }: { category: Category }) {
    const IconComponent = iconMap[category.icon] ?? Home

    return (
        <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-6 sm:p-8 text-center transition-all duration-200 hover:shadow-md hover:bg-gray-100/80">
            <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-brand-accent/10">
                <IconComponent className="size-7 text-brand-accent" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
                {category.description}
            </p>
        </div>
    )
}

function LandingVirtualTour({
    sectionTitle,
    subtitle,
    categories,
    comingSoon,
    className,
}: LandingVirtualTourProps) {
    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                        {sectionTitle}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => (
                        <CategoryCard key={index} category={category} />
                    ))}
                </div>

                {/* Coming Soon Notice */}
                {comingSoon && (
                    <div className="mt-12 md:mt-16 flex flex-col items-center rounded-2xl border border-brand-accent/20 bg-brand-accent/5 p-8 sm:p-10 text-center">
                        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-brand-accent/10">
                            <Eye className="size-7 text-brand-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {comingSoon.title}
                        </h3>
                        <p className="text-gray-600 max-w-lg mb-6 leading-relaxed">
                            {comingSoon.description}
                        </p>
                        {comingSoon.ctaHref ? (
                            <Button asChild size="lg">
                                <a href={comingSoon.ctaHref}>
                                    {comingSoon.ctaLabel}
                                </a>
                            </Button>
                        ) : (
                            <Button size="lg">
                                {comingSoon.ctaLabel}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export {
    LandingVirtualTour,
    type LandingVirtualTourProps,
    type Category,
    type ComingSoon,
}
