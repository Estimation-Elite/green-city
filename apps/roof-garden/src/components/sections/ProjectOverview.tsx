import { LandingProjectOverview } from "@repo/ui";
import { projectOverviewData } from "@/data/roof-garden";

export function ProjectOverview() {
  return <LandingProjectOverview {...projectOverviewData} />;
}
