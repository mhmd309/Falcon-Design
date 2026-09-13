import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/config/site";
import type { SiteSection } from "@/types/content";
import { cn, pickLocalized, resolveContentHref } from "@/lib/utils";
import { HeroMotion } from "@/components/ui/motion";

function resolveHref(locale: Locale, href: string | null) {
  return resolveContentHref(locale, href);
}

export function HomeHero({
  locale,
  section,
}: {
  locale: Locale;
  section: SiteSection;
}) {
  const title = pickLocalized(section, locale, "title");
  const subtitle = pickLocalized(section, locale, "subtitle");
  const description = pickLocalized(section, locale, "description");
  const primaryLabel = pickLocalized(section, locale, "primary_button");
  const secondaryLabel = pickLocalized(section, locale, "secondary_button");
  const imageAlt = pickLocalized(section, locale, "alt_text") || title;
  const imageUrl = section.image_url || "/gallery/10.jpeg";

  const primaryHref = resolveHref(locale, section.primary_button_href);
  const secondaryHref = resolveHref(locale, section.secondary_button_href);

  return (
    <section
      className="relative flex min-h-[min(88vh,820px)] items-end overflow-hidden bg-bg text-white"
      aria-labelledby="hero-heading"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(198,161,91,0.16),transparent_50%)]"
        aria-hidden
      />

      <div className="container-page relative z-10 pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
        <HeroMotion>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold sm:mb-4 sm:text-xs md:text-sm">
            <span className="text-gold">FALCON</span>{" "}
            <span className="text-white">DESIGN</span>
          </p>
          {title ? (
            <h1
              id="hero-heading"
              className="max-w-4xl text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              {title}
            </h1>
          ) : (
            <h1
              id="hero-heading"
              className="max-w-4xl text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-6xl"
            >
              <span className="text-gold">FALCON</span> DESIGN
            </h1>
          )}
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base font-medium text-gold-soft sm:mt-4 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          ) : null}
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base md:text-lg">
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            {primaryLabel && section.primary_button_href ? (
              <Link
                href={primaryHref}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-on-gold shadow-[0_10px_30px_rgba(198,161,91,0.25)] transition hover:bg-gold-soft focus-visible:outline-none sm:px-7 sm:text-base",
                )}
              >
                {primaryLabel}
              </Link>
            ) : null}
            {secondaryLabel && section.secondary_button_href ? (
              <Link
                href={secondaryHref}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center rounded-md border border-gold/45 bg-transparent px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:border-gold hover:bg-gold/10 focus-visible:outline-none sm:px-7 sm:text-base",
                )}
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </HeroMotion>
      </div>
    </section>
  );
}
