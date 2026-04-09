import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/archipel";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
