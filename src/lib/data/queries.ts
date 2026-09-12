import {
  certificates,
  contactEmails,
  contactSettings,
  coreValues,
  galleryCategories,
  galleryItems,
  pages,
  sections,
  services,
  siteSettings,
  statistics,
  team,
  timeline,
} from "@/lib/data/content";
import type {
  Certificate,
  ContactEmail,
  ContactSettings,
  CoreValue,
  GalleryCategory,
  GalleryItem,
  Service,
  SitePage,
  SiteSection,
  SiteSettings,
  Statistic,
  TeamMember,
  TimelineItem,
} from "@/types/database";

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getPageBySlug(slug: string): Promise<SitePage | null> {
  return pages.find((p) => p.slug === slug && p.is_published) || null;
}

export async function getSection(
  pageSlug: string,
  sectionKey: string,
): Promise<SiteSection | null> {
  return (
    sections.find(
      (s) =>
        s.page_slug === pageSlug &&
        s.section_key === sectionKey &&
        s.is_published,
    ) || null
  );
}

export async function getStatistics(): Promise<Statistic[]> {
  return statistics.filter((s) => s.is_active);
}

export async function getServices(options?: {
  featuredOnly?: boolean;
}): Promise<Service[]> {
  let rows = services.filter((s) => s.is_active && s.is_published);
  if (options?.featuredOnly) rows = rows.filter((s) => s.is_featured);
  return rows;
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return coreValues.filter((s) => s.is_active);
}

export async function getTimeline(): Promise<TimelineItem[]> {
  return timeline.filter((s) => s.is_active);
}

export async function getTeam(): Promise<TeamMember[]> {
  return team.filter((s) => s.is_active);
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return galleryCategories.filter((s) => s.is_active);
}

export async function getGalleryItems(options?: {
  featuredOnly?: boolean;
}): Promise<GalleryItem[]> {
  let rows = galleryItems.filter((g) => g.is_active && g.is_published);
  if (options?.featuredOnly) rows = rows.filter((g) => g.is_featured);
  return rows;
}

export async function getContactSettings(): Promise<ContactSettings> {
  return contactSettings;
}

export async function getContactEmails(): Promise<ContactEmail[]> {
  return contactEmails.filter(
    (e) =>
      e.is_active &&
      e.email.trim().length > 0 &&
      !/^EMAIL_[1-5]$/i.test(e.email) &&
      e.email.includes("@"),
  );
}

export async function getCertificates(options?: {
  featuredOnly?: boolean;
}): Promise<Certificate[]> {
  let rows = certificates.filter((c) => c.is_active);
  if (options?.featuredOnly) rows = rows.filter((c) => c.is_featured);
  return rows;
}
