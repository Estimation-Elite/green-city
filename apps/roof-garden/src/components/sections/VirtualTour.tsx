import { LandingVirtualTour } from "@repo/ui";
import { virtualTourData } from "@/data/roof-garden";

export function VirtualTour() {
  return <LandingVirtualTour {...virtualTourData} />;
}
