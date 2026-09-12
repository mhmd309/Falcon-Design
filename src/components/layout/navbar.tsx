"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/config/site";
import { publicNav } from "@/config/site";
import { cn, localizedPath } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { t } from "@/lib/i18n/ui";

function isActivePath(pathname: string, locale: Locale, href: string) {
  const base = `/${locale}`;
  if (!href) {
    return pathname === base || pathname === `${base}/`;
  }
  return pathname === `${base}${href}` || pathname.startsWith(`${base}${href}/`);
}

export function Navbar({
  locale,
  companyName,
}: {
  locale: Locale;
  companyName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const copy = t(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href={localizedPath(locale)}
          className="flex h-11 w-11 shrink-0 items-center justify-center md:h-14 md:w-14"
        >
          <Image
            src="/logo.png"
            alt={companyName || "Falcon Design"}
            width={1152}
            height={1408}
            priority
            className="h-full w-full object-contain"
          />
          <span className="sr-only">{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {publicNav.map((item) => {
            const active = isActivePath(pathname, locale, item.href);
            return (
              <Link
                key={item.href}
                href={localizedPath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium transition hover:cursor-pointer hover:text-gold",
                  active ? "text-gold" : "text-white/90",
                )}
              >
                {item.label[locale]}
                {active ? (
                  <span
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gold"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle locale={locale} />
          <LanguageSwitcher locale={locale} />
          <Link
            href={localizedPath(locale, "/contact")}
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-[#0b0d10] transition hover:bg-gold-soft"
          >
            {copy.navCta}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle locale={locale} />
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            className="inline-flex cursor-pointer rounded-md border border-white/15 p-2 text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#0b0d10] px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {publicNav.map((item) => {
              const active = isActivePath(pathname, locale, item.href);
              return (
                <Link
                  key={item.href}
                  href={localizedPath(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2 py-2 transition",
                    active
                      ? "bg-gold/15 text-gold"
                      : "text-white/90 hover:bg-white/5 hover:text-gold",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label[locale]}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex items-center justify-start gap-3">
            <Link
              href={localizedPath(locale, "/contact")}
              className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-[#0b0d10]"
              onClick={() => setOpen(false)}
            >
              {copy.navCta}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
