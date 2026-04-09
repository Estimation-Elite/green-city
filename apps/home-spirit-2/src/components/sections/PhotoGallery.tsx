import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/home-spirit-2";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
