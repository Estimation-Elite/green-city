import { createLeadHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit";

export const POST = createLeadHandler({
  defaultResidenceName: siteConfig.projectName,
});
