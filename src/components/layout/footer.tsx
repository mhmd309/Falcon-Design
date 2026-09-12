import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { publicNav, siteConfig } from "@/config/site";
import { localizedPath, pickLocalized, safeExternalUrl } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import type { ContactEmail, ContactSettings, SiteSettings } from "@/types/database";
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
      ? `2019-${year} \u00a9 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629 \u0644\u062f\u0649 \u0634\u0631\u0643\u0629 \u0641\u0627\u0644\u0643\u0648\u0646 \u062f\u064a\u0632\u0627\u064a\u0646`
      : `2019-${year} \u00a9 All rights reserved to Falcon Design`; /*
    locale === "ar"
      ? `2019–${year} © \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629 \u0644\u062f\u0649 \u0634\u0631\u0643\u0629 \u0641\u0627\u0644\u0643\u0648\u0646 \u062f\u064a\u0632\u0627\u064a\u0646`
      : `2019–${year} © All rights reserved to Falcon Design`;

  */
  const social = [
    { label: "Facebook", href: safeExternalUrl(contact?.facebook_url || settings.facebook_url) },
    { label: "Instagram", href: safeExternalUrl(contact?.instagram_url || settings.instagram_url) },
    { label: "LinkedIn", href: safeExternalUrl(contact?.linkedin_url || settings.linkedin_url) },
    { label: "YouTube", href: safeExternalUrl(contact?.youtube_url || settings.youtube_url) },
    { label: "X", href: safeExternalUrl(contact?.x_url || settings.x_url) },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#0b0d10] text-text">
      <div className="container-page grid gap-12 py-20 sm:py-24 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1.1fr] lg:gap-x-20 lg:gap-y-16">
        <div>
          <Image
            src="/logo.png"
            alt={company || "Falcon Design"}
            width={1152}
            height={1408}
            className="h-32 w-28 object-contain"
          />
          <p className="mt-5 max-w-xs text-sm leading-7 text-text-muted">
            {pickLocalized(settings, locale, "tagline") || siteConfig.tagline[locale]}
          </p>
          <p className="mt-4 text-sm text-text-muted">{company}</p>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-gold">
            {locale === "ar" ? "التنقل" : "Navigate"}
          </h3>
          <ul className="space-y-3 text-sm text-text-muted">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizedPath(locale, item.href)}
                  className="hover:text-gold"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-gold">
            {copy.contactEmails}
          </h3>
          <ul className="space-y-4 text-sm text-text-muted">
            {emails.map((email) => (
              <li key={email.id}>
                <a
                  href={`mailto:${email.email}`}
                  className="hover:text-gold"
                >
                  <span className="block text-text">
                    {pickLocalized(email, locale, "label")}
                  </span>
                  {email.email}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-gold">
            {locale === "ar" ? "التواصل" : "Contact"}
          </h3>
          <ul className="space-y-3 text-sm text-text-muted">
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {phone}
                </a>
              </li>
            ) : null}
            {address ? <li>{address}</li> : null}
          </ul>
          {social.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-steel">
                {copy.followUs}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                {social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-gold"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-7">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        © {year} {company}. {copy.rights}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-text-muted">
        {copyright}
      </div>
    </footer>
  );
}
