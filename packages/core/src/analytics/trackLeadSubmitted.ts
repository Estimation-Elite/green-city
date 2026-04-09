import { pushDataLayerEvent } from "./dataLayer";

export function trackLeadSubmitted(leadId: string) {
  pushDataLayerEvent({
    event: "lead_submitted",
    event_id: leadId,
  });
}
