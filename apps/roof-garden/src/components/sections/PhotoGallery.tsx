import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/roof-garden";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
