import Link from "next/link";
import type { Locale } from "@/config/site";
import type { SiteSection } from "@/types/database";
import { localizedPath, pickLocalized } from "@/lib/utils";

function resolveHref(locale: Locale, href: string | null) {
  if (!href) return localizedPath(locale, "/contact");
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  return localizedPath(locale, href);
}

export function CtaBanner({
  locale,
  section,
}: {
  locale: Locale;
  section: SiteSection | null;
}) {
  if (!section) return null;

  const title = pickLocalized(section, locale, "title");
  const description = pickLocalized(section, locale, "description");
  const buttonLabel = pickLocalized(section, locale, "primary_button");
  const href = resolveHref(locale, section.primary_button_href);

  if (!title && !description) return null;

  return (
    <section
      className="relative overflow-hidden bg-bg text-text"
      aria-labelledby="cta-banner-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(198,161,91,0.14),transparent_60%)]"
        aria-hidden
      />
      <div className="metallic-line" aria-hidden />
      <div className="container-page relative section-space">
        <div className="mx-auto max-w-3xl text-center">
          {title ? (
            <h2
              id="cta-banner-heading"
              className="text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
              {description}
            </p>
          ) : null}
          {buttonLabel ? (
            <div className="mt-8">
              <Link
                href={href}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gold px-7 py-3.5 text-base font-semibold tracking-wide text-text-dark shadow-[0_10px_30px_rgba(198,161,91,0.25)] transition hover:bg-gold-soft focus-visible:outline-none"
              >
                {buttonLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <div className="metallic-line" aria-hidden />
    </section>
  );
}
