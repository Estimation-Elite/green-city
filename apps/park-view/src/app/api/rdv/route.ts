import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
});
