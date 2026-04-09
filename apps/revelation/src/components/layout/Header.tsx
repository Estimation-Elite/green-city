import { Header as SharedHeader } from "@repo/ui";
import { headerData } from "@/data/revelation";

export function Header() {
  return <SharedHeader {...headerData} />;
}
