import { createGtmPreviewMiddleware } from "@repo/core/analytics/gtmMiddleware";

export const middleware = createGtmPreviewMiddleware({
  getGtmId: () => process.env.GTM_ID,
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
