import type { GalleryItem, ProjectRecord } from "@/types/content";

export function mapProjectRecordToGalleryItem(
  project: ProjectRecord,
): GalleryItem {
  const title = project.ownerName;
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
    executing_contractor_name: project.executingContractorName,
    created_at: project.createdAt,
  };
}

export function getDbProjectId(galleryItemId: string) {
  return galleryItemId.startsWith("db-") ? galleryItemId.slice(3) : null;
}

export function toProjectRecord(project: {
  id: string;
  imageUrl: string;
  ownerName: string;
  consultantName: string;
  projectContractorName: string;
  executingContractorName: string;
  createdAt: Date;
}): ProjectRecord {
  return {
    id: project.id,
    imageUrl: project.imageUrl,
    ownerName: project.ownerName,
    consultantName: project.consultantName,
    projectContractorName: project.projectContractorName,
    executingContractorName: project.executingContractorName,
    createdAt: project.createdAt.toISOString(),
  };
}
