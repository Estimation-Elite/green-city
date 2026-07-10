import { pushDataLayerEvent } from "./dataLayer";

export function trackPhoneVerified(leadId: string) {
  pushDataLayerEvent({
    event: "phone_verified",
    event_id: leadId,
  });
}
