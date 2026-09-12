import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { publicNav, siteConfig } from "@/config/site";
import { localizedPath, pickLocalized, safeExternalUrl } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import type {
  ContactEmail,
  ContactSettings,
  SiteSettings,
} from "@/types/database";
import { LanguageSwitcher } from "./language-switcher";

export function Footer({
  locale,
  settings,
  contact,
  emails,
}: {
  locale: Locale;
  settings: SiteSettings;
  contact: ContactSettings | null;
  emails: ContactEmail[];
}) {
  const copy = t(locale);
  const company = pickLocalized(settings, locale, "company_name");
  const address =
    pickLocalized(contact || settings, locale, "address") ||
    pickLocalized(settings, locale, "address");
  const phone = contact?.phone || settings.phone;
  const year = new Date().getFullYear();
  const copyright =
    locale === "ar"
      ? `2019-${year} © جميع الحقوق محفوظة لدى شركة فالكون ديزاين`
      : `2019-${year} © All rights reserved to Falcon Design`;

  const social = [
    {
      label: "Facebook",
      href: safeExternalUrl(contact?.facebook_url || settings.facebook_url),
    },
    {
      label: "Instagram",
      href: safeExternalUrl(contact?.instagram_url || settings.instagram_url),
    },
    {
      label: "LinkedIn",
      href: safeExternalUrl(contact?.linkedin_url || settings.linkedin_url),
    },
    {
      label: "YouTube",
      href: safeExternalUrl(contact?.youtube_url || settings.youtube_url),
    },
    {
      label: "X",
      href: safeExternalUrl(contact?.x_url || settings.x_url),
    },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#0b0d10] text-text">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Image
              src="/logo.png"
              alt={company || "Falcon Design"}
              width={1152}
              height={1408}
              className="h-24 w-auto object-contain sm:h-28"
            />
            <p className="mt-5 max-w-sm text-sm leading-7 text-text-muted">
              {pickLocalized(settings, locale, "tagline") ||
                siteConfig.tagline[locale]}
            </p>
            <p className="mt-3 text-sm font-medium text-text">{company}</p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold">
              {copy.footerNav}
            </h3>
            <ul className="space-y-2.5 text-sm text-text-muted">
              {publicNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(locale, item.href)}
                    className="transition hover:text-gold"
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold">
              {copy.footerEmails}
            </h3>
            <ul className="space-y-3.5 text-sm">
              {emails.map((email) => (
                <li key={email.id}>
                  <a
                    href={`mailto:${email.email}`}
                    className="group block transition"
                  >
                    <span className="block text-text group-hover:text-gold">
                      {pickLocalized(email, locale, "label")}
                    </span>
                    <span className="mt-0.5 block break-all text-text-muted group-hover:text-gold-soft">
                      {email.email}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold">
              {copy.footerContact}
            </h3>
            <ul className="space-y-2.5 text-sm text-text-muted">
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="transition hover:text-gold"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? <li className="max-w-xs leading-6">{address}</li> : null}
            </ul>
            {social.length ? (
              <div className="mt-5">
                <p className="mb-2 text-xs tracking-[0.16em] text-steel uppercase">
                  {copy.followUs}
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {social.map((item) => (
                    <a
                      key={item.label}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition hover:text-gold"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-center text-xs text-text-muted sm:text-start">
            {copyright}
          </p>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  );
}
