export type Locale = "en" | "ar";

export interface SiteSettings {
  id: string;
  company_name_ar: string;
  company_name_en: string;
  tagline_ar: string | null;
  tagline_en: string | null;
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  address_ar: string | null;
  address_en: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
}

export interface SitePage {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  show_in_navigation: boolean;
  sort_order: number;
  is_published: boolean;
  seo_title_ar: string | null;
  seo_title_en: string | null;
  seo_description_ar: string | null;
  seo_description_en: string | null;
  og_title_ar: string | null;
  og_title_en: string | null;
  og_description_ar: string | null;
  og_description_en: string | null;
  og_image: string | null;
  canonical_url: string | null;
  updated_at?: string;
}

export interface SiteSection {
  id: string;
  page_slug: string;
  section_key: string;
  title_ar: string | null;
  title_en: string | null;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  primary_button_ar: string | null;
  primary_button_en: string | null;
  primary_button_href: string | null;
  secondary_button_ar: string | null;
  secondary_button_en: string | null;
  secondary_button_href: string | null;
  image_url: string | null;
  alt_text_ar: string | null;
  alt_text_en: string | null;
  extra: Record<string, unknown>;
  is_published: boolean;
}

export interface Statistic {
  id: string;
  value: string;
  prefix: string | null;
  suffix: string | null;
  label_ar: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  title_ar: string;
  title_en: string;
  short_description_ar: string | null;
  short_description_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
  alt_text_ar: string | null;
  alt_text_en: string | null;
  icon: string | null;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface CoreValue {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TimelineItem {
  id: string;
  year: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TeamMember {
  id: string;
  name_ar: string;
  name_en: string;
  position_ar: string | null;
  position_en: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  image_url: string | null;
  alt_text_ar: string | null;
  alt_text_en: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface GalleryCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  category_id: string | null;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string;
  alt_text_ar: string | null;
  alt_text_en: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  is_published: boolean;
  gallery_categories?: GalleryCategory | null;
}

export interface ContactSettings {
  id: string;
  page_title_ar: string | null;
  page_title_en: string | null;
  page_description_ar: string | null;
  page_description_en: string | null;
  company_name_ar: string | null;
  company_name_en: string | null;
  address_ar: string | null;
  address_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  business_hours_ar: string | null;
  business_hours_en: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
}

export interface ContactEmail {
  id: string;
  label_ar: string;
  label_en: string;
  email: string;
  is_active: boolean;
  sort_order: number;
}

export interface Certificate {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  issuer_ar: string | null;
  issuer_en: string | null;
  year: string | null;
  image_url: string;
  alt_text_ar: string | null;
  alt_text_en: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export type Localized<T extends Record<string, unknown>> = {
  [K in keyof T as K extends `${infer Base}_ar` | `${infer Base}_en`
    ? Base
    : K]: T[K];
};
