import { LandingEquipment } from "@repo/ui";
import { equipmentData } from "@/data/revelation";

export function Equipment() {
  return <LandingEquipment {...equipmentData} />;
}
