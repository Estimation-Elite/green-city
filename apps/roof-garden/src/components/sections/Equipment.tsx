import { LandingEquipment } from "@repo/ui";
import { equipmentData } from "@/data/roof-garden";

export function Equipment() {
  return <LandingEquipment {...equipmentData} />;
}
