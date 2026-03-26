import { LandingConnectivity } from "@repo/ui";
import { connectivityData } from "@/data/roof-garden";

export function Connectivity() {
  return <LandingConnectivity {...connectivityData} />;
}
