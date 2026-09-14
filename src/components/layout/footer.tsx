import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const brand = locale === "ar" ? siteConfig.nameAr : siteConfig.name;
  const copyright =
    locale === "ar"
      ? `2019-${year} © جميع الحقوق محفوظة لدى ${brand}`
      : `2019-${year} © All rights reserved to ${brand}`;

  return (
    <footer className="border-t border-steel/15 bg-bg text-text-muted">
      <div className="container-page py-5 text-center text-xs">{copyright}</div>
    </footer>
  );
}
