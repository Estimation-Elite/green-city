import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/revelation";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
