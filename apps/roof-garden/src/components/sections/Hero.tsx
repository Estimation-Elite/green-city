import { LandingHero } from "@repo/ui";
import { heroData } from "@/data/roof-garden";

export function Hero() {
  return <LandingHero {...heroData} />;
}
