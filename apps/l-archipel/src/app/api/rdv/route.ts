import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/archipel";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 7,
});
