"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/utils";
import type { Locale } from "@/config/site";

function UaeFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" fill="#00732f" />
      <rect y="5.33" width="24" height="5.34" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#000" />
      <rect width="6" height="16" fill="#ff0000" />
    </svg>
  );
}

function UkFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="2.6" />
    </svg>
  );
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const enHref = switchLocalePath(pathname, "en");
  const arHref = switchLocalePath(pathname, "ar");

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-steel/25 bg-card px-1 py-1"
      role="group"
      aria-label="Language switcher"
    >
      <Link
        href={enHref}
        className={`inline-flex cursor-pointer items-center justify-center rounded px-2 py-1 transition ${
          locale === "en"
            ? "bg-gold"
            : "opacity-70 hover:opacity-100"
        }`}
        hrefLang="en"
        lang="en"
        aria-label="English"
        title="English"
      >
        <UkFlag className="h-3.5 w-5 rounded-[2px] shadow-sm" />
      </Link>
      <span className="text-steel/50" aria-hidden>
        |
      </span>
      <Link
        href={arHref}
        className={`inline-flex cursor-pointer items-center justify-center rounded px-2 py-1 transition ${
          locale === "ar"
            ? "bg-gold"
            : "opacity-70 hover:opacity-100"
        }`}
        hrefLang="ar"
        lang="ar"
        aria-label="العربية"
        title="العربية"
      >
        <UaeFlag className="h-3.5 w-5 rounded-[2px] shadow-sm" />
      </Link>
    </div>
  );
}
