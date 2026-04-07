import { LandingContact } from "@repo/ui";
import { contactData } from "@/data/revelation";

export function Contact() {
  return <LandingContact {...contactData} />;
}
