import { GalleryEditor } from "@/components/admin/forms/gallery-editor";
import { getAdminGalleryCategories, getAdminGalleryItems } from "@/lib/data/queries";

export default async function AdminGalleryPage() {
  const [items, categories] = await Promise.all([
    getAdminGalleryItems(),
    getAdminGalleryCategories(),
  ]);

  return <GalleryEditor items={items} categories={categories} />;
}
