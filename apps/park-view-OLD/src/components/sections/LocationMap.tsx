import { LandingLocationMap } from "@repo/ui";
import { locationMapData } from "@/data/park-view";

export function LocationMap() {
  return <LandingLocationMap {...locationMapData} />;
}
