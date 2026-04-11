import { Flame } from "lucide-react";

interface LotsAvailableBadgeProps {
  count: number;
  variant?: "accent" | "dark" | "light";
  className?: string;
}

function LotsAvailableBadge({
  count,
  variant = "accent",
  className = "",
}: LotsAvailableBadgeProps) {
  const styles = {
    accent:
      "bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full",
    dark: "bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full",
    light:
      "bg-dark/5 text-foreground text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 ${styles[variant]} ${className}`}
    >
      <Flame className="w-4 h-4" />
      Plus que {count} lots disponibles
    </span>
  );
}

export { LotsAvailableBadge, type LotsAvailableBadgeProps };
