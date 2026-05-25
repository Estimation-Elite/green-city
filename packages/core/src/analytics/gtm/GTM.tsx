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
      {/* Google Consent Mode v2 — default state is 'denied' until the user
          interacts with the cookie banner. Must run BEFORE the GTM loader so
          downstream tags read the right state. wait_for_update gives the
          banner 500ms to inject an explicit choice on returning visitors. */}
      <Script id="gtm-consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied',
          'wait_for_update': 500
        });
      `}</Script>
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
