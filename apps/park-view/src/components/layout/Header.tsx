import { Header as SharedHeader } from "@repo/ui";
import { headerData } from "@/data/home-spirit";

export function Header() {
  return <SharedHeader {...headerData} />;
}
