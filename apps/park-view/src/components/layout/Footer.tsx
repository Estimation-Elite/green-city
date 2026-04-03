import { Footer as SharedFooter } from "@repo/ui";
import { footerData } from "@/data/park-view";

export function Footer() {
  return <SharedFooter {...footerData} />;
}
