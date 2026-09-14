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
import { mapProjectToGalleryItem, sortGalleryItems } from "@/lib/projects";
import type {
  Certificate,
  ContactEmail,
  CoreValue,
  GalleryCategory,
  GalleryItem,
  ProjectRecord,
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

export async function getDbGalleryItems(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects.map(
      (project: {
        id: string;
        imageUrl: string;
        ownerName: string;
        consultantName: string;
        projectContractorName: string;
        executingContractorName: string;
        createdAt: Date;
      }): GalleryItem => {
        const record: ProjectRecord = {
          id: project.id,
          imageUrl: project.imageUrl,
          ownerName: project.ownerName,
          consultantName: project.consultantName,
          projectContractorName: project.projectContractorName,
          executingContractorName: project.executingContractorName,
          createdAt: project.createdAt.toISOString(),
        };
        return mapProjectToGalleryItem(record);
      },
    );
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
  const dbItems = await getDbGalleryItems();

  if (options?.featuredOnly) {
    return sortGalleryItems(dbItems.filter((i) => i.is_featured));
  }

  return sortGalleryItems(dbItems);
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
