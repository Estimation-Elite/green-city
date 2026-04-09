import { LandingContact } from "@repo/ui";
import { contactData } from "@/data/park-view";

export function Contact() {
  return <LandingContact {...contactData} />;
}
