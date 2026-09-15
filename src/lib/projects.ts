import type { GalleryItem, ProjectRecord } from "@/types/content";

export function projectDbId(itemId: string) {
  return itemId.startsWith("db-") ? itemId.slice(3) : null;
}

export function mapProjectToGalleryItem(project: ProjectRecord): GalleryItem {
  const title =
    project.ownerName?.trim() ||
    project.consultantName?.trim() ||
    project.projectContractorName?.trim() ||
    "Project";

  return {
    id: `db-${project.id}`,
    category_id: null,
    title_ar: title,
    title_en: title,
    description_ar: null,
    description_en: null,
    image_url: project.imageUrl,
    alt_text_ar: title,
    alt_text_en: title,
    is_featured: true,
    source: "database",
    owner_name: project.ownerName,
    consultant_name: project.consultantName,
    project_contractor_name: project.projectContractorName,
    created_at: project.createdAt,
  };
}

export function sortGalleryItems(items: GalleryItem[]) {
  return [...items].sort((a, b) => {
    const aDb = a.source === "database" ? 1 : 0;
    const bDb = b.source === "database" ? 1 : 0;
    if (aDb !== bDb) return bDb - aDb;

    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return bTime - aTime;
  });
}

export function storagePathFromPublicUrl(imageUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = imageUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(imageUrl.slice(index + marker.length));
}
