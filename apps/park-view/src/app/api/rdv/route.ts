import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  rdvListId: process.env.BREVO_RDV_LIST_ID
    ? Number(process.env.BREVO_RDV_LIST_ID)
    : undefined,
});
