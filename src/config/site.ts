export const siteConfig = {
  name: "Falcon Design Metal Construction",
  nameAr: "فالكون ديزاين للإنشاءات المعدنيه",
  nameShort: "Falcon Design",
  nameShortAr: "فالكون ديزاين",
  legalName: "Falcon Design Metal Construction — Sole Proprietorship",
  defaultLocale: "ar" as const,
  locales: ["ar", "en"] as const,
  tagline: {
    en: "Where Proven Mastery Meets Structural Innovation",
    ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
  },
  keywords: {
    en: [
      "Falcon Design Metal Construction",
      "Falcon Design",
      "steel fabrication UAE",
      "aluminum works Al Ain",
      "steel structure erection",
      "metal works Abu Dhabi",
      "metal construction Al Ain",
    ],
    ar: [
      "فالكون ديزاين للإنشاءات المعدنيه",
      "فالكون ديزاين",
      "أعمال الصلب الإمارات",
      "أعمال الألمنيوم العين",
      "هياكل فولاذية",
      "أعمال معدنية أبوظبي",
      "إنشاءات معدنية العين",
    ],
  },
  geo: {
    latitude: 24.2075,
    longitude: 55.7447,
    locality: "Al Ain",
    region: "Abu Dhabi",
    country: "AE",
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const publicNav = [
  { href: "", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/about", label: { en: "About", ar: "من نحن" } },
  { href: "/services", label: { en: "Services", ar: "خدماتنا" } },
  { href: "/gallery", label: { en: "Gallery", ar: "المشاريع" } },
  { href: "/certificates", label: { en: "Certificates", ar: "الشهادات" } },
  { href: "/contact", label: { en: "Contact", ar: "تواصل معنا" } },
] as const;

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://falcon-design.vercel.app"
  );
}
