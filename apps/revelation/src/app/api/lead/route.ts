import { createLeadHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/revelation";

export const POST = createLeadHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 8,
});
