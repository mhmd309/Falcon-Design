import Link from "next/link";
import type { Locale } from "@/config/site";
import type { SiteSection } from "@/types/content";
import { cn, pickLocalized, resolveContentHref } from "@/lib/utils";
import { HeroMotion } from "@/components/ui/motion";
import { HeroMedia } from "@/components/home/hero-media";

function resolveHref(locale: Locale, href: string | null) {
  return resolveContentHref(locale, href);
}

function HeroWave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 leading-[0]" aria-hidden>
      <svg
        className="block h-[72px] w-full sm:h-[96px] md:h-[120px]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,72 C240,120 480,24 720,64 C960,104 1200,32 1440,72 L1440,120 L0,120 Z"
          className="fill-[var(--bg)]"
        />
        <path
          d="M0,86 C280,118 520,48 760,78 C1000,108 1220,58 1440,86 L1440,120 L0,120 Z"
          className="fill-[var(--bg)] opacity-70"
        />
      </svg>
    </div>
  );
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

  const primaryHref = resolveHref(locale, section.primary_button_href);
  const secondaryHref = resolveHref(locale, section.secondary_button_href);

  return (
    <section
      className="relative flex min-h-[min(88vh,820px)] items-end overflow-hidden bg-[#12161c] text-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <HeroMedia alt={imageAlt} />
      </div>

      {/* Readability overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0b0d10]/96 via-[#0b0d10]/68 to-[#0b0d10]/45"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_80%,rgba(198,161,91,0.14),transparent_52%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,13,16,0.72)_0%,transparent_48%)]"
        aria-hidden
      />

      <div className="container-page relative z-10 pb-24 pt-28 sm:pb-28 sm:pt-32 md:pb-36 md:pt-40">
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

      <HeroWave />
    </section>
  );
}
