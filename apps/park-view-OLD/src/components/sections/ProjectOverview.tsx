import { LandingProjectOverview } from "@repo/ui";
import { projectOverviewData } from "@/data/park-view";

export function ProjectOverview() {
  return <LandingProjectOverview {...projectOverviewData} />;
}
