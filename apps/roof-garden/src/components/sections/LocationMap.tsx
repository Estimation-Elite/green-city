import { LandingLocationMap } from "@repo/ui";
import { locationMapData } from "@/data/roof-garden";

export function LocationMap() {
  return <LandingLocationMap {...locationMapData} />;
}
