import { createLeadHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/archipel";

export const POST = createLeadHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 7,
});
