export type GTMPreviewParams = {
  gtm_auth?: string;
  gtm_preview?: string;
  gtm_debug?: string;
};

export const GTM_PREVIEW_PARAM_KEYS = [
  "gtm_auth",
  "gtm_preview",
  "gtm_debug",
] as const;

export function getPreviewCookieNames(gtmId: string) {
  return {
    auth: `gtm_auth__${gtmId}`,
    preview: `gtm_preview__${gtmId}`,
    debug: `gtm_debug__${gtmId}`,
  };
}

export function pickPreviewParams(
  input: Record<string, string | undefined>,
): GTMPreviewParams {
  const gtm_auth = input.gtm_auth;
  const gtm_preview = input.gtm_preview;

  if (!gtm_auth || !gtm_preview) {
    return {};
  }

  return {
    gtm_auth,
    gtm_preview,
    gtm_debug: input.gtm_debug,
  };
}

export function buildGtmScriptSrc(
  gtmId: string,
  params: GTMPreviewParams = {},
): string {
  const url = new URL("https://www.googletagmanager.com/gtm.js");
  url.searchParams.set("id", gtmId);

  if (params.gtm_auth && params.gtm_preview) {
    url.searchParams.set("gtm_auth", params.gtm_auth);
    url.searchParams.set("gtm_preview", params.gtm_preview);
    url.searchParams.set("gtm_debug", params.gtm_debug ?? "x");
  }

  return url.toString();
}

export function stripGtmPreviewParams(url: URL): URL {
  GTM_PREVIEW_PARAM_KEYS.forEach((key) => url.searchParams.delete(key));
  return url;
}
