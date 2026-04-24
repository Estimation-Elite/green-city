import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/archipel";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 7,
  rdvListId: process.env.BREVO_RDV_LIST_ID
    ? Number(process.env.BREVO_RDV_LIST_ID)
    : undefined,
  rdvProgrammeCategoryValue: 1, // ARCHIPEL
});
