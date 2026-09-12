"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/utils";
import type { Locale } from "@/config/site";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const enHref = switchLocalePath(pathname, "en");
  const arHref = switchLocalePath(pathname, "ar");

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-1 py-1 text-xs font-semibold"
      role="group"
      aria-label="Language switcher"
    >
      <Link
        href={enHref}
        className={`cursor-pointer rounded px-2.5 py-1 transition ${
          locale === "en"
            ? "bg-gold text-[#0b0d10]"
            : "text-white/80 hover:text-white"
        }`}
        hrefLang="en"
        lang="en"
      >
        EN
      </Link>
      <span className="text-white/30" aria-hidden>
        |
      </span>
      <Link
        href={arHref}
        className={`cursor-pointer rounded px-2.5 py-1 transition ${
          locale === "ar"
            ? "bg-gold text-[#0b0d10]"
            : "text-white/80 hover:text-white"
        }`}
        hrefLang="ar"
        lang="ar"
      >
        عربي
      </Link>
    </div>
  );
}
