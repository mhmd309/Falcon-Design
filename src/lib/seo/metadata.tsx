import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getSiteUrl, siteConfig } from "@/config/site";
import type { GalleryItem, Service, SitePage } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

function formatPageTitle(title: string, locale: Locale): string {
  const brandNames = [
    siteConfig.name,
    siteConfig.nameAr,
    siteConfig.nameShort,
    siteConfig.nameShortAr,
  ];
  const alreadyBranded = brandNames.some((name) =>
    title.toLowerCase().includes(name.toLowerCase()),
  );
  if (alreadyBranded) return title;
  const brand = locale === "ar" ? siteConfig.nameAr : siteConfig.name;
  return `${title} | ${brand}`;
}

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

  const rawTitle =
    (locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ||
    (locale === "ar" ? page?.title_ar : page?.title_en) ||
    (locale === "ar" ? siteConfig.nameAr : siteConfig.name);

  const title = formatPageTitle(rawTitle, locale);

  const description =
    (locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ||
    siteConfig.tagline[locale];

  const ogTitle =
    (locale === "ar" ? page?.og_title_ar : page?.og_title_en) || title;
  const ogDescription =
    (locale === "ar" ? page?.og_description_ar : page?.og_description_en) ||
    description;
  const ogImagePath = page?.og_image || "/gallery/01.jpeg";
  const ogImageUrl = absoluteUrl(ogImagePath);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [...siteConfig.keywords[locale]],
    authors: [{ name: locale === "ar" ? siteConfig.nameAr : siteConfig.name, url: siteUrl }],
    creator: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
    publisher: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
    category: "construction",
    alternates: {
      canonical,
      languages: {
        en: alternateEn,
        ar: alternateAr,
        "x-default": alternateAr,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? ["en_AE"] : ["ar_AE"],
      url: absoluteUrl(localizedPath),
      siteName: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

type OrgSettings = {
  company_name_en: string;
  company_name_ar: string;
  phone: string | null;
  whatsapp?: string | null;
  address_en: string | null;
  address_ar: string | null;
  logo_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  youtube_url?: string | null;
  x_url?: string | null;
};

export function organizationJsonLd(settings: OrgSettings, locale: Locale) {
  const sameAs = [
    settings.facebook_url,
    settings.instagram_url,
    settings.linkedin_url,
    settings.youtube_url,
    settings.x_url,
  ].filter(Boolean);
  const siteUrl = getSiteUrl();
  const name =
    locale === "ar" ? settings.company_name_ar : settings.company_name_en;
  const description = siteConfig.tagline[locale];
  const streetAddress =
    locale === "ar" ? settings.address_ar : settings.address_en;
  const logo = absoluteUrl(settings.logo_url || "/logo.png");

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "GeneralContractor"],
    "@id": `${siteUrl}/#organization`,
    name,
    legalName: siteConfig.legalName,
    alternateName: [
      settings.company_name_en,
      settings.company_name_ar,
    ].filter((n) => n !== name),
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    image: logo,
    description,
    telephone: settings.phone || undefined,
    email: "falcondesign20@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress || undefined,
      addressLocality: siteConfig.geo.locality,
      addressRegion: siteConfig.geo.region,
      addressCountry: siteConfig.geo.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Al Ain",
      },
      {
        "@type": "AdministrativeArea",
        name: "Abu Dhabi",
      },
      {
        "@type": "Country",
        name: "United Arab Emirates",
      },
    ],
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: settings.phone || undefined,
        contactType: "customer service",
        areaServed: "AE",
        availableLanguage: ["ar", "en"],
      },
      settings.whatsapp
        ? {
          "@type": "ContactPoint",
          telephone: settings.whatsapp,
          contactType: "WhatsApp",
          areaServed: "AE",
          availableLanguage: ["ar", "en"],
        }
        : null,
    ].filter(Boolean),
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: [
      "Steel structure erection",
      "Aluminum fabrication",
      "Metal works",
      "General contracting",
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
    alternateName:
      locale === "ar"
        ? [siteConfig.name, siteConfig.nameShortAr]
        : [siteConfig.nameAr, siteConfig.nameShort],
    url: `${siteUrl}/${locale}`,
    inLanguage: locale === "ar" ? "ar-AE" : "en-AE",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    copyrightHolder: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function contactPageJsonLd(locale: Locale, phone: string | null) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/${locale}/contact#contactpage`,
    name: locale === "ar" ? "تواصل معنا" : "Contact",
    url: `${siteUrl}/${locale}/contact`,
    inLanguage: locale === "ar" ? "ar-AE" : "en-AE",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#organization`,
      telephone: phone || undefined,
    },
  };
}

export function servicesItemListJsonLd(locale: Locale, services: Service[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/${locale}/services#servicelist`,
    name: locale === "ar" ? "خدمات فالكون ديزاين للإنشاءات المعدنيه" : "Falcon Design Metal Construction Services",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: locale === "ar" ? service.title_ar : service.title_en,
        description:
          locale === "ar"
            ? service.short_description_ar || service.description_ar
            : service.short_description_en || service.description_en,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: "AE",
      },
    })),
  };
}

export function galleryJsonLd(locale: Locale, items: GalleryItem[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteUrl}/${locale}/gallery#gallery`,
    name:
      locale === "ar"
        ? "معرض مشاريع فالكون ديزاين للإنشاءات المعدنيه"
        : "Falcon Design Metal Construction Project Gallery",
    url: `${siteUrl}/${locale}/gallery`,
    inLanguage: locale === "ar" ? "ar-AE" : "en-AE",
    isPartOf: { "@id": `${siteUrl}/#website` },
    image: items.slice(0, 12).map((item) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(item.image_url),
      name: locale === "ar" ? item.title_ar : item.title_en,
      description:
        locale === "ar"
          ? item.description_ar || item.alt_text_ar
          : item.description_en || item.alt_text_en,
    })),
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

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
