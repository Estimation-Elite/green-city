import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/park-view";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
