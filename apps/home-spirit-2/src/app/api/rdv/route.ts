import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit-2";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 9,
});
