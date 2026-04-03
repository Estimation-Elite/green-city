import { LandingEquipment } from "@repo/ui";
import { equipmentData } from "@/data/park-view";

export function Equipment() {
  return <LandingEquipment {...equipmentData} />;
}
