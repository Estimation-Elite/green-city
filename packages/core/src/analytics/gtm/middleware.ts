import { NextRequest, NextResponse } from "next/server";
import {
  getPreviewCookieNames,
  pickPreviewParams,
  stripGtmPreviewParams,
} from "./gtm";

type GtmPreviewMiddlewareOptions = {
  getGtmId: (req: NextRequest) => string | undefined;
};

export const defaultConfigMatcher = [
  "/((?!_next|favicon.ico|.*\\..*).*)",
];

export function createGtmPreviewMiddleware({
  getGtmId,
}: GtmPreviewMiddlewareOptions) {
  return (req: NextRequest) => {
    const gtmId = getGtmId(req);
    if (!gtmId) {
      return NextResponse.next();
    }

    const searchParams = req.nextUrl.searchParams;
    const previewParams = pickPreviewParams({
      gtm_auth: searchParams.get("gtm_auth") ?? undefined,
      gtm_preview: searchParams.get("gtm_preview") ?? undefined,
      gtm_debug: searchParams.get("gtm_debug") ?? undefined,
    });

    if (!previewParams.gtm_auth || !previewParams.gtm_preview) {
      return NextResponse.next();
    }

    const nextUrl = stripGtmPreviewParams(req.nextUrl.clone());
    const response = NextResponse.redirect(nextUrl);
    const cookieNames = getPreviewCookieNames(gtmId);

    response.cookies.set(cookieNames.auth, previewParams.gtm_auth, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    response.cookies.set(cookieNames.preview, previewParams.gtm_preview, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    if (previewParams.gtm_debug) {
      response.cookies.set(cookieNames.debug, previewParams.gtm_debug, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  };
}
