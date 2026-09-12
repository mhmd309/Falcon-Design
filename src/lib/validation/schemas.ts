import { z } from "zod";

const optionalText = (max: number) =>
  z.union([z.string().trim().max(max), z.literal(""), z.null()]).optional();

const optionalUrl = z.union([
  z.string().trim().url().max(500),
  z.literal(""),
  z.null(),
]).optional();

/** Accept real UUIDs or stable demo/fallback ids used before Supabase seeding. */
const idSchema = z.string().min(1).max(64);

const emailOrPlaceholder = z
  .string()
  .trim()
  .max(200)
  .refine(
    (value) =>
      /^EMAIL_[1-5]$/.test(value) ||
      z.string().email().safeParse(value).success,
    { message: "Invalid email" },
  );

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["en", "ar"]).optional(),
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const bilingualRequired = z.object({
  ar: z.string().trim().min(1).max(500),
  en: z.string().trim().min(1).max(500),
});

export const seoFieldsSchema = z.object({
  seo_title_ar: optionalText(120),
  seo_title_en: optionalText(120),
  seo_description_ar: optionalText(300),
  seo_description_en: optionalText(300),
  og_title_ar: optionalText(120),
  og_title_en: optionalText(120),
  og_description_ar: optionalText(300),
  og_description_en: optionalText(300),
  og_image: optionalText(500),
  canonical_url: optionalUrl,
});

export const contactEmailSchema = z.object({
  id: idSchema,
  label_ar: z.string().trim().min(1).max(80),
  label_en: z.string().trim().min(1).max(80),
  email: emailOrPlaceholder,
  is_active: z.boolean(),
  sort_order: z.number().int().min(1).max(5),
});

export const imageUploadMetaSchema = z.object({
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  width: z.number().int().positive().max(8000).optional(),
  height: z.number().int().positive().max(8000).optional(),
});

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const sectionUpdateSchema = z.object({
  page_slug: z.string().min(1),
  section_key: z.string().min(1),
  title_ar: z.string().max(500).optional().nullable(),
  title_en: z.string().max(500).optional().nullable(),
  subtitle_ar: z.string().max(500).optional().nullable(),
  subtitle_en: z.string().max(500).optional().nullable(),
  description_ar: z.string().max(5000).optional().nullable(),
  description_en: z.string().max(5000).optional().nullable(),
  primary_button_ar: z.string().max(120).optional().nullable(),
  primary_button_en: z.string().max(120).optional().nullable(),
  primary_button_href: z.string().max(500).optional().nullable(),
  secondary_button_ar: z.string().max(120).optional().nullable(),
  secondary_button_en: z.string().max(120).optional().nullable(),
  secondary_button_href: z.string().max(500).optional().nullable(),
  image_url: z.string().max(500).optional().nullable(),
  alt_text_ar: z.string().max(300).optional().nullable(),
  alt_text_en: z.string().max(300).optional().nullable(),
  is_published: z.boolean().optional(),
});

export const statisticSchema = z.object({
  id: idSchema.optional(),
  value: z.string().trim().min(1).max(40),
  prefix: z.string().max(20).optional().nullable(),
  suffix: z.string().max(20).optional().nullable(),
  label_ar: z.string().trim().min(1).max(120),
  label_en: z.string().trim().min(1).max(120),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const serviceSchema = z.object({
  id: idSchema.optional(),
  title_ar: z.string().trim().min(1).max(200),
  title_en: z.string().trim().min(1).max(200),
  short_description_ar: z.string().max(500).optional().nullable(),
  short_description_en: z.string().max(500).optional().nullable(),
  description_ar: z.string().max(5000).optional().nullable(),
  description_en: z.string().max(5000).optional().nullable(),
  image_url: z.string().max(500).optional().nullable(),
  alt_text_ar: z.string().max(300).optional().nullable(),
  alt_text_en: z.string().max(300).optional().nullable(),
  icon: z.string().max(80).optional().nullable(),
  category: z.enum(["steel", "aluminum", "other"]).or(z.string().min(1).max(40)),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0),
});

export const galleryCategorySchema = z.object({
  id: idSchema.optional(),
  name_ar: z.string().trim().min(1).max(120),
  name_en: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(80),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const galleryItemSchema = z.object({
  id: idSchema.optional(),
  category_id: idSchema.nullable().optional(),
  title_ar: z.string().trim().min(1).max(200),
  title_en: z.string().trim().min(1).max(200),
  description_ar: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
  image_url: z.string().trim().min(1).max(500),
  alt_text_ar: z.string().max(300).optional().nullable(),
  alt_text_en: z.string().max(300).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  is_published: z.boolean(),
});

export const coreValueSchema = z.object({
  id: idSchema.optional(),
  title_ar: z.string().trim().min(1).max(200),
  title_en: z.string().trim().min(1).max(200),
  description_ar: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
  icon: z.string().max(80).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const timelineItemSchema = z.object({
  id: idSchema.optional(),
  year: z.string().trim().min(1).max(20),
  title_ar: z.string().trim().min(1).max(200),
  title_en: z.string().trim().min(1).max(200),
  description_ar: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const teamMemberSchema = z.object({
  id: idSchema.optional(),
  name_ar: z.string().trim().min(1).max(200),
  name_en: z.string().trim().min(1).max(200),
  position_ar: z.string().max(200).optional().nullable(),
  position_en: z.string().max(200).optional().nullable(),
  bio_ar: z.string().max(2000).optional().nullable(),
  bio_en: z.string().max(2000).optional().nullable(),
  image_url: z.string().max(500).optional().nullable(),
  alt_text_ar: z.string().max(300).optional().nullable(),
  alt_text_en: z.string().max(300).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const siteSettingsSchema = z.object({
  id: idSchema,
  company_name_ar: z.string().trim().min(1).max(200),
  company_name_en: z.string().trim().min(1).max(200),
  tagline_ar: optionalText(300),
  tagline_en: optionalText(300),
  logo_url: optionalText(500),
  phone: optionalText(40),
  whatsapp: optionalText(40),
  address_ar: optionalText(500),
  address_en: optionalText(500),
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  linkedin_url: optionalUrl,
  youtube_url: optionalUrl,
  x_url: optionalUrl,
});

export const contactSettingsSchema = z.object({
  id: idSchema,
  page_title_ar: optionalText(200),
  page_title_en: optionalText(200),
  page_description_ar: optionalText(1000),
  page_description_en: optionalText(1000),
  company_name_ar: optionalText(300),
  company_name_en: optionalText(300),
  address_ar: optionalText(500),
  address_en: optionalText(500),
  phone: optionalText(40),
  whatsapp: optionalText(40),
  business_hours_ar: optionalText(200),
  business_hours_en: optionalText(200),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  google_maps_url: optionalUrl,
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  linkedin_url: optionalUrl,
  youtube_url: optionalUrl,
  x_url: optionalUrl,
});

export const messageStatusSchema = z.object({
  id: idSchema,
  status: z.enum(["new", "read", "replied", "archived"]),
});

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
