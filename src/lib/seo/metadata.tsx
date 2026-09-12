import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getSiteUrl, siteConfig } from "@/config/site";
import type { SitePage } from "@/types/database";
import { absoluteUrl } from "@/lib/utils";

export function buildPageMetadata(
  locale: Locale,
  path: string,
  page: SitePage | null,
): Metadata {
  const siteUrl = getSiteUrl();
  const localizedPath = `/${locale}${path}`;
  const alternateEn = `${siteUrl}/en${path}`;
  const alternateAr = `${siteUrl}/ar${path}`;
  const canonical =
    page?.canonical_url || absoluteUrl(localizedPath);

  const title =
    (locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ||
    (locale === "ar" ? page?.title_ar : page?.title_en) ||
    siteConfig.name;

  const description =
    (locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ||
    siteConfig.tagline[locale];

  const ogTitle =
    (locale === "ar" ? page?.og_title_ar : page?.og_title_en) || title;
  const ogDescription =
    (locale === "ar" ? page?.og_description_ar : page?.og_description_en) ||
    description;
  const ogImage = page?.og_image || "/gallery/01.jpeg";

  return {
    title: {
      absolute: title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        en: alternateEn,
        ar: alternateAr,
        "x-default": alternateEn,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: absoluteUrl(ogImage) }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export function organizationJsonLd(settings: {
  company_name_en: string;
  company_name_ar: string;
  phone: string | null;
  address_en: string | null;
  address_ar: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  youtube_url?: string | null;
  x_url?: string | null;
}, locale: Locale) {
  const sameAs = [
    settings.facebook_url,
    settings.instagram_url,
    settings.linkedin_url,
    settings.youtube_url,
    settings.x_url,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: locale === "ar" ? settings.company_name_ar : settings.company_name_en,
    url: getSiteUrl(),
    telephone: settings.phone || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Al Ain",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
      streetAddress:
        locale === "ar" ? settings.address_ar : settings.address_en,
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${getSiteUrl()}/${locale}`,
    inLanguage: locale === "ar" ? "ar" : "en",
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(`/${locale}${item.path}`),
    })),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
