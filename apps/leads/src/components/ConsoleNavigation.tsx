import Link from "next/link";

type ConsoleNavigationProps = {
  currentPage: "leads" | "residences";
};

const navItems = [
  { href: "/", label: "Leads", key: "leads" },
  { href: "/residences", label: "Residences", key: "residences" },
] as const;

export function ConsoleNavigation({
  currentPage,
}: ConsoleNavigationProps) {
  return (
    <nav className="flex flex-wrap gap-3">
      {navItems.map((item) => {
        const isActive = item.key === currentPage;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-white text-primary"
                : "border border-white/15 bg-white/8 text-white/82 hover:bg-white/14"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
