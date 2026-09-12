import type { Locale } from "@/config/site";
import type { ContactEmail, ContactSettings } from "@/types/database";
import { pickLocalized, safeExternalUrl } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";

export function ContactInfo({
  locale,
  settings,
  emails,
}: {
  locale: Locale;
  settings: ContactSettings;
  emails: ContactEmail[];
}) {
  const copy = t(locale);
  const mapUrl =
    safeExternalUrl(settings.google_maps_url) ||
    (settings.latitude && settings.longitude
      ? `https://maps.google.com/?q=${settings.latitude},${settings.longitude}`
      : null);
  const embedSrc =
    settings.latitude && settings.longitude
      ? `https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=12&output=embed`
      : null;

  const social = [
    { label: "Facebook", href: safeExternalUrl(settings.facebook_url) },
    { label: "Instagram", href: safeExternalUrl(settings.instagram_url) },
    { label: "LinkedIn", href: safeExternalUrl(settings.linkedin_url) },
    { label: "YouTube", href: safeExternalUrl(settings.youtube_url) },
    { label: "X", href: safeExternalUrl(settings.x_url) },
  ].filter((s) => s.href);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-dark">
          {pickLocalized(settings, locale, "page_title") ||
            (locale === "ar" ? "تواصل معنا" : "Contact Us")}
        </h2>
        <p className="mt-2 text-text-dark-muted">
          {pickLocalized(settings, locale, "page_description")}
        </p>
      </div>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-text-dark">{copy.address}</dt>
          <dd className="mt-1 text-text-dark-muted">
            {pickLocalized(settings, locale, "company_name")}
            <br />
            {pickLocalized(settings, locale, "address")}
          </dd>
        </div>
        {settings.phone ? (
          <div>
            <dt className="font-semibold text-text-dark">{copy.phone}</dt>
            <dd className="mt-1">
              <a
                className="text-gold hover:text-gold-soft"
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
              >
                {settings.phone}
              </a>
            </dd>
          </div>
        ) : null}
        {settings.whatsapp ? (
          <div>
            <dt className="font-semibold text-text-dark">{copy.whatsapp}</dt>
            <dd className="mt-1">
              <a
                className="text-gold hover:text-gold-soft"
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.whatsapp}
              </a>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold text-text-dark">{copy.hours}</dt>
          <dd className="mt-1 text-text-dark-muted">
            {pickLocalized(settings, locale, "business_hours")}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-text-dark">{copy.contactEmails}</dt>
          <dd className="mt-2 space-y-2">
            {emails.map((email) => (
              <a
                key={email.id}
                href={`mailto:${email.email}`}
                className="block text-text-dark-muted hover:text-gold"
              >
                <span className="font-medium text-text-dark">
                  {pickLocalized(email, locale, "label")}:{" "}
                </span>
                {email.email}
              </a>
            ))}
          </dd>
        </div>
      </dl>

      {social.length ? (
        <div>
          <p className="text-sm font-semibold text-text-dark">{copy.followUs}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-soft"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {embedSrc ? (
        <div className="overflow-hidden rounded-xl border border-steel/20">
          <iframe
            title="Google Maps"
            src={embedSrc}
            className="h-64 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-semibold text-gold"
        >
          Open in Google Maps
        </a>
      ) : null}
    </div>
  );
}
