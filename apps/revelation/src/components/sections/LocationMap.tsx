import { LandingLocationMap } from "@repo/ui";
import { locationMapData } from "@/data/revelation";

export function LocationMap() {
  return <LandingLocationMap {...locationMapData} />;
}
