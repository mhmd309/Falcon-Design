export const siteConfig = {
  name: "Falcon Design",
  legalName: "Falcon Design General Contracting — Sole Proprietorship",
  defaultLocale: "ar" as const,
  locales: ["ar", "en"] as const,
  tagline: {
    en: "Where Proven Mastery Meets Structural Innovation",
    ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
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
    "http://localhost:3000"
  );
}
