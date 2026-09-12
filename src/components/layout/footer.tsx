import Link from "next/link";
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

  const social = [
    { label: "Facebook", href: safeExternalUrl(contact?.facebook_url || settings.facebook_url) },
    { label: "Instagram", href: safeExternalUrl(contact?.instagram_url || settings.instagram_url) },
    { label: "LinkedIn", href: safeExternalUrl(contact?.linkedin_url || settings.linkedin_url) },
    { label: "YouTube", href: safeExternalUrl(contact?.youtube_url || settings.youtube_url) },
    { label: "X", href: safeExternalUrl(contact?.x_url || settings.x_url) },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/10 bg-[#0b0d10] text-text">
      <div className="container-page section-space grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold tracking-[0.08em]">
            <span className="text-gold">FALCON</span> DESIGN
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {pickLocalized(settings, locale, "tagline") || siteConfig.tagline[locale]}
          </p>
          <p className="mt-4 text-sm text-text-muted">{company}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            {locale === "ar" ? "التنقل" : "Navigate"}
          </h3>
          <ul className="space-y-2 text-sm text-text-muted">
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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            {copy.contactEmails}
          </h3>
          <ul className="space-y-2 text-sm text-text-muted">
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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            {locale === "ar" ? "التواصل" : "Contact"}
          </h3>
          <ul className="space-y-2 text-sm text-text-muted">
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
          <div className="mt-6">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-text-muted">
        © {year} {company}. {copy.rights}
      </div>
    </footer>
  );
}
