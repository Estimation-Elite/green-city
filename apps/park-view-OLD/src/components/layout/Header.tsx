import { Header as SharedHeader } from "@repo/ui";
import { headerData } from "@/data/park-view";

export function Header() {
  return <SharedHeader {...headerData} />;
}
