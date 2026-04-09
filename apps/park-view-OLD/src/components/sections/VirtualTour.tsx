import { LandingVirtualTour } from "@repo/ui";
import { virtualTourData } from "@/data/park-view";

export function VirtualTour() {
  return <LandingVirtualTour {...virtualTourData} />;
}
