import Script from "next/script";
import { cookies } from "next/headers";
import { buildGtmScriptSrc, getPreviewCookieNames, pickPreviewParams } from "./gtm";

type GTMProps = {
  gtmId?: string;
  enabled?: boolean;
};

export async function GTM({ gtmId, enabled = true }: GTMProps) {
  if (!enabled || !gtmId) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieNames = getPreviewCookieNames(gtmId);
  const previewParams = pickPreviewParams({
    gtm_auth: cookieStore.get(cookieNames.auth)?.value,
    gtm_preview: cookieStore.get(cookieNames.preview)?.value,
    gtm_debug: cookieStore.get(cookieNames.debug)?.value,
  });
  const src = buildGtmScriptSrc(gtmId, previewParams);
  const gtmSrc = JSON.stringify(src);

  return (
    <>
      <Script id="gtm" strategy="beforeInteractive">{`
        (function(w,d,s,l){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0], j=d.createElement(s);
          j.async=true; j.src=${gtmSrc};
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
            gtmId,
          )}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
