import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  fallbackContactEmails,
  fallbackContactSettings,
  fallbackCoreValues,
  fallbackGalleryCategories,
  fallbackGalleryItems,
  fallbackPages,
  fallbackSections,
  fallbackServices,
  fallbackSiteSettings,
  fallbackStatistics,
  fallbackTeam,
  fallbackTimeline,
} from "@/lib/data/fallback";
import type {
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

async function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("QUERY_TIMEOUT")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function safeQuery<T>(
  fallback: T,
  runner: () => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    return await withTimeout(runner());
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeQuery(fallbackSiteSettings, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return fallbackSiteSettings;
    return data as SiteSettings;
  });
}

export async function getPageBySlug(slug: string): Promise<SitePage | null> {
  const local = fallbackPages.find((p) => p.slug === slug) || null;
  return safeQuery(local, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return local;
    return data as SitePage;
  });
}

export async function getSection(
  pageSlug: string,
  sectionKey: string,
): Promise<SiteSection | null> {
  const local =
    fallbackSections.find(
      (s) => s.page_slug === pageSlug && s.section_key === sectionKey,
    ) || null;
  return safeQuery(local, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .eq("page_slug", pageSlug)
      .eq("section_key", sectionKey)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return local;
    return data as SiteSection;
  });
}

export async function getStatistics(): Promise<Statistic[]> {
  return safeQuery(fallbackStatistics, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackStatistics;
    return data as Statistic[];
  });
}

export async function getServices(options?: {
  featuredOnly?: boolean;
}): Promise<Service[]> {
  const local = options?.featuredOnly
    ? fallbackServices.filter((s) => s.is_featured)
    : fallbackServices;
  return safeQuery(local, async () => {
    const supabase = await createClient();
    let query = supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (options?.featuredOnly) query = query.eq("is_featured", true);
    const { data, error } = await query;
    if (error || !data?.length) return local;
    return data as Service[];
  });
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return safeQuery(fallbackCoreValues, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackCoreValues;
    return data as CoreValue[];
  });
}

export async function getTimeline(): Promise<TimelineItem[]> {
  return safeQuery(fallbackTimeline, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackTimeline;
    return data as TimelineItem[];
  });
}

export async function getTeam(): Promise<TeamMember[]> {
  return safeQuery(fallbackTeam, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackTeam;
    return data as TeamMember[];
  });
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return safeQuery(fallbackGalleryCategories, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackGalleryCategories;
    return data as GalleryCategory[];
  });
}

export async function getGalleryItems(options?: {
  featuredOnly?: boolean;
}): Promise<GalleryItem[]> {
  const local = options?.featuredOnly
    ? fallbackGalleryItems.filter((g) => g.is_featured)
    : fallbackGalleryItems;
  return safeQuery(local, async () => {
    const supabase = await createClient();
    let query = supabase
      .from("gallery_items")
      .select("*, gallery_categories(*)")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (options?.featuredOnly) query = query.eq("is_featured", true);
    const { data, error } = await query;
    if (error || !data?.length) return local;
    return data as GalleryItem[];
  });
}

export async function getContactSettings(): Promise<ContactSettings> {
  return safeQuery(fallbackContactSettings, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return fallbackContactSettings;
    return data as ContactSettings;
  });
}

const ENV_CONTACT_KEYS = [
  "CONTACT_EMAIL_1",
  "CONTACT_EMAIL_2",
  "CONTACT_EMAIL_3",
  "CONTACT_EMAIL_4",
  "CONTACT_EMAIL_5",
] as const;

/** Resolve CONTACT_EMAIL_1..5 from env for placeholder substitution. */
export function getEnvContactEmails(): (string | undefined)[] {
  return ENV_CONTACT_KEYS.map((key) => process.env[key] || undefined);
}

function resolveEmailPlaceholders(emails: ContactEmail[]): ContactEmail[] {
  const envEmails = getEnvContactEmails();
  return emails.map((email) => {
    const match = /^EMAIL_([1-5])$/.exec(email.email);
    if (!match) return email;
    const index = Number(match[1]) - 1;
    const fromEnv = envEmails[index];
    if (!fromEnv || fromEnv === `EMAIL_${match[1]}`) return email;
    return { ...email, email: fromEnv };
  });
}

export async function getContactEmails(): Promise<ContactEmail[]> {
  const rows = await safeQuery(fallbackContactEmails, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_emails")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(5);
    if (error || !data?.length) return fallbackContactEmails;
    return data as ContactEmail[];
  });
  return resolveEmailPlaceholders(rows);
}

export async function getAdminSection(
  pageSlug: string,
  sectionKey: string,
): Promise<SiteSection | null> {
  const local =
    fallbackSections.find(
      (s) => s.page_slug === pageSlug && s.section_key === sectionKey,
    ) || null;
  if (!isSupabaseConfigured()) return local;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .eq("page_slug", pageSlug)
      .eq("section_key", sectionKey)
      .maybeSingle();
    if (error || !data) return local;
    return data as SiteSection;
  } catch {
    return local;
  }
}

export async function getAdminPage(slug: string): Promise<SitePage | null> {
  const local = fallbackPages.find((p) => p.slug === slug) || null;
  if (!isSupabaseConfigured()) return local;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return local;
    return data as SitePage;
  } catch {
    return local;
  }
}

export async function getAdminStatistics(): Promise<Statistic[]> {
  if (!isSupabaseConfigured()) return fallbackStatistics;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackStatistics;
    return data as Statistic[];
  } catch {
    return fallbackStatistics;
  }
}

export async function getAdminServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) return fallbackServices;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackServices;
    return data as Service[];
  } catch {
    return fallbackServices;
  }
}

export async function getAdminCoreValues(): Promise<CoreValue[]> {
  if (!isSupabaseConfigured()) return fallbackCoreValues;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackCoreValues;
    return data as CoreValue[];
  } catch {
    return fallbackCoreValues;
  }
}

export async function getAdminTimeline(): Promise<TimelineItem[]> {
  if (!isSupabaseConfigured()) return fallbackTimeline;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackTimeline;
    return data as TimelineItem[];
  } catch {
    return fallbackTimeline;
  }
}

export async function getAdminTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return fallbackTeam;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackTeam;
    return data as TeamMember[];
  } catch {
    return fallbackTeam;
  }
}

export async function getAdminGalleryCategories(): Promise<GalleryCategory[]> {
  if (!isSupabaseConfigured()) return fallbackGalleryCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackGalleryCategories;
    return data as GalleryCategory[];
  } catch {
    return fallbackGalleryCategories;
  }
}

export async function getAdminGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return fallbackGalleryItems;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, gallery_categories(*)")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackGalleryItems;
    return data as GalleryItem[];
  } catch {
    return fallbackGalleryItems;
  }
}

export async function getAdminContactMessages() {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  const [services, gallery] = await Promise.all([
    getServices(),
    getGalleryItems(),
  ]);

  let messages = 0;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });
      messages = count || 0;
    } catch {
      messages = 0;
    }
  }

  return {
    services: services.length,
    gallery: gallery.length,
    messages,
    activeServices: services.filter((s) => s.is_active).length,
    featuredProjects: gallery.filter((g) => g.is_featured).length,
  };
}
