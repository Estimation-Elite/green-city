import { Header as SharedHeader } from "@repo/ui";
import { headerData } from "@/data/archipel";

export function Header() {
  return <SharedHeader {...headerData} />;
}
