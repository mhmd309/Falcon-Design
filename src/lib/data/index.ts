import {
  certificates,
  contactEmails,
  coreValues,
  galleryCategories,
  galleryItems,
  pages,
  sections,
  services,
  siteSettings,
  statistics,
  timeline,
} from "@/lib/data/content";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import type {
  Certificate,
  ContactEmail,
  CoreValue,
  GalleryCategory,
  GalleryItem,
  Service,
  SitePage,
  SiteSection,
  SiteSettings,
  Statistic,
  TimelineItem,
} from "@/types/content";

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}

export function getPageBySlug(slug: string): SitePage | null {
  return pages.find((p) => p.slug === slug) || null;
}

export function getSection(
  pageSlug: string,
  sectionKey: string,
): SiteSection | null {
  return (
    sections.find(
      (s) => s.page_slug === pageSlug && s.section_key === sectionKey,
    ) || null
  );
}

export function getStatistics(): Statistic[] {
  return statistics;
}

export function getServices(options?: {
  featuredOnly?: boolean;
}): Service[] {
  if (options?.featuredOnly) {
    return services.filter((s) => s.is_featured);
  }
  return services;
}

export function getCoreValues(): CoreValue[] {
  return coreValues;
}

export function getTimeline(): TimelineItem[] {
  return timeline;
}

export function getGalleryCategories(): GalleryCategory[] {
  return galleryCategories;
}

function mapDbProjectToGalleryItem(project: {
  id: string;
  imageUrl: string;
  clientName: string;
  ownerName: string;
  consultantName: string;
  projectContractorName: string;
  executingContractorName: string;
}): GalleryItem {
  const title = project.clientName;
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
    client_name: project.clientName,
    owner_name: project.ownerName,
    consultant_name: project.consultantName,
    project_contractor_name: project.projectContractorName,
    executing_contractor_name: project.executingContractorName,
  };
}

export async function getDbGalleryItems(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects.map(mapDbProjectToGalleryItem);
  } catch (error) {
    console.error("getDbGalleryItems failed", error);
    return [];
  }
}

export function getGalleryItems(options?: {
  featuredOnly?: boolean;
}): GalleryItem[] {
  const staticItems = galleryItems.map((item) => ({
    ...item,
    source: "static" as const,
  }));

  if (options?.featuredOnly) {
    return staticItems.filter((g) => g.is_featured);
  }
  return staticItems;
}

export async function getMergedGalleryItems(options?: {
  featuredOnly?: boolean;
}): Promise<GalleryItem[]> {
  const [dbItems, staticItems] = await Promise.all([
    getDbGalleryItems(),
    Promise.resolve(getGalleryItems(options)),
  ]);

  if (options?.featuredOnly) {
    return [...dbItems.filter((i) => i.is_featured), ...staticItems];
  }

  return [...dbItems, ...staticItems];
}

export function getContactEmails(): ContactEmail[] {
  return contactEmails.filter((e) => e.email.includes("@"));
}

export function getCertificates(options?: {
  featuredOnly?: boolean;
}): Certificate[] {
  if (options?.featuredOnly) {
    return certificates.filter((c) => c.is_featured);
  }
  return certificates;
}
