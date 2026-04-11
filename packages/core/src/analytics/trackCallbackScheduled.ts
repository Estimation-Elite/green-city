import { pushDataLayerEvent } from "./dataLayer";

export function trackCallbackScheduled(leadId: string) {
  pushDataLayerEvent({
    event: "callback_scheduled",
    event_id: leadId,
  });
}
