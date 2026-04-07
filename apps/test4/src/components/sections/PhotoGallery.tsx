import { LandingPhotoGallery } from "@repo/ui";
import { photoGalleryData } from "@/data/home-spirit";

export function PhotoGallery() {
  return <LandingPhotoGallery {...photoGalleryData} />;
}
