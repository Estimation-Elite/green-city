import { LandingConnectivity } from "@repo/ui";
import { connectivityData } from "@/data/park-view";

export function Connectivity() {
  return <LandingConnectivity {...connectivityData} />;
}
