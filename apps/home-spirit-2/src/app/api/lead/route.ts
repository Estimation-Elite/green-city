import { createLeadHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit-2";

export const POST = createLeadHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 9,
});
