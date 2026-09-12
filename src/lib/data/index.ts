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

/** Thin accessors over static content in `content.ts`. */

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

export function getGalleryItems(options?: {
  featuredOnly?: boolean;
}): GalleryItem[] {
  if (options?.featuredOnly) {
    return galleryItems.filter((g) => g.is_featured);
  }
  return galleryItems;
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
