import { LandingProximity } from "@repo/ui";
import { proximityData } from "@/data/park-view";

export function Proximity() {
  return <LandingProximity {...proximityData} />;
}
