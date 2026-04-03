import { LandingHero } from "@repo/ui";
import { heroData } from "@/data/park-view";

export function Hero() {
  return <LandingHero {...heroData} />;
}
