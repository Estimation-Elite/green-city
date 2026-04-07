import { LandingProjectOverview } from "@repo/ui";
import { projectOverviewData } from "@/data/revelation";

export function ProjectOverview() {
  return <LandingProjectOverview {...projectOverviewData} />;
}
