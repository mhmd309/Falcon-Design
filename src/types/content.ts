/** Static website content models (no database). */

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
}

export interface Statistic {
  id: string;
  value: string;
  prefix: string | null;
  suffix: string | null;
  label_ar: string;
  label_en: string;
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
  is_featured: boolean;
}

export interface CoreValue {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
}

export interface TimelineItem {
  id: string;
  year: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
}

export interface GalleryCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
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
  is_featured: boolean;
}

export interface ContactEmail {
  id: string;
  label_ar: string;
  label_en: string;
  email: string;
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
  is_featured: boolean;
}
