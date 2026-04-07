import { LandingConnectivity } from "@repo/ui";
import { connectivityData } from "@/data/revelation";

export function Connectivity() {
  return <LandingConnectivity {...connectivityData} />;
}
