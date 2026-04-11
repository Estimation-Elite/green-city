import { pushDataLayerEvent } from "./dataLayer";

export function trackVisitScheduled(leadId: string) {
  pushDataLayerEvent({
    event: "visit_scheduled",
    event_id: leadId,
  });
}
