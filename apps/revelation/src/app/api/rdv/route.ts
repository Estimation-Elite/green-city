import { createRdvHandler } from "@repo/core/api-routes";
import { siteConfig } from "@/data/revelation";

export const POST = createRdvHandler({
  defaultResidenceName: siteConfig.projectName,
  nurturingListId: 8,
  rdvListId: process.env.BREVO_RDV_LIST_ID
    ? Number(process.env.BREVO_RDV_LIST_ID)
    : undefined,
  rdvProgrammeCategoryValue: 2, // REVELATION
});
