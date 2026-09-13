import type { Locale } from "@/config/site";

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const copyright =
    locale === "ar"
      ? `2019-${year} © جميع الحقوق محفوظة لدى شركة فالكون ديزاين`
      : `2019-${year} © All rights reserved to Falcon Design`;

  return (
    <footer className="border-t border-steel/15 bg-bg text-text-muted">
      <div className="container-page py-5 text-center text-xs">{copyright}</div>
    </footer>
  );
}
