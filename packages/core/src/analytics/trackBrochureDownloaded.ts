import { pushDataLayerEvent } from "./dataLayer";

export function trackBrochureDownloaded() {
  pushDataLayerEvent({
    event: "brochure_downloaded",
  });
}
