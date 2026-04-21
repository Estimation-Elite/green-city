import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/revelation";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 8,
});
