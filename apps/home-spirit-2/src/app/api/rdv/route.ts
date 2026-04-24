import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/home-spirit-2";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 9,
  rdvListId: process.env.BREVO_RDV_LIST_ID
    ? Number(process.env.BREVO_RDV_LIST_ID)
    : undefined,
  rdvProgrammeCategoryValue: 3, // HOME_SPIRIT2
});
