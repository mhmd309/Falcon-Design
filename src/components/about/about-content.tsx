import Image from "next/image";
import type { Locale } from "@/config/site";
import type {
  CoreValue,
  SiteSection,
  TimelineItem,
} from "@/types/database";
import { pickLocalized } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import { t } from "@/lib/i18n/ui";

export function AboutContent({
  locale,
  intro,
  vision,
  mission,
  values,
  timeline,
}: {
  locale: Locale;
  intro: SiteSection | null;
  vision: SiteSection | null;
  mission: SiteSection | null;
  values: CoreValue[];
  timeline: TimelineItem[];
}) {
  const copy = t(locale);
  const title = intro
    ? pickLocalized(intro, locale, "title")
    : locale === "ar"
      ? "من نحن"
      : "About Us";

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden bg-bg text-text">
        {intro?.image_url ? (
          <Image
            src={intro.image_url}
            alt={
              pickLocalized(intro, locale, "alt_text") ||
              pickLocalized(intro, locale, "title")
            }
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/72 to-[#0b0d10]/35" />
        <div className="container-page relative flex min-h-[70vh] flex-col justify-end pb-14 pt-28 sm:pb-16 md:pb-20">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-gold-soft uppercase">
              Falcon Design
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {intro ? (
              <p className="mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
                {pickLocalized(intro, locale, "subtitle")}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {intro ? (
        <section className="section-space">
          <div className="container-page">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <div className="metallic-line mx-auto mb-8 w-24" />
                <p className="text-lg leading-relaxed text-text-dark-muted sm:text-xl md:leading-8">
                  {pickLocalized(intro, locale, "description")}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {(vision || mission) && (
        <section className="border-y border-steel/15 bg-bg text-text">
          <div className="container-page grid gap-0 md:grid-cols-2">
            {vision ? (
              <Reveal>
                <div className="border-steel/15 py-14 md:border-e md:pe-12 md:py-16">
                  <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                    {copy.vision}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                    {pickLocalized(vision, locale, "title")}
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
                    {pickLocalized(vision, locale, "description")}
                  </p>
                </div>
              </Reveal>
            ) : null}
            {mission ? (
              <Reveal delay={0.06}>
                <div className="py-14 md:ps-12 md:py-16">
                  <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                    {copy.mission}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                    {pickLocalized(mission, locale, "title")}
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
                    {pickLocalized(mission, locale, "description")}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      )}

      {values.length ? (
        <section className="section-space">
          <div className="container-page">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl md:text-4xl">
                {copy.ourValues}
              </h2>
              <div className="metallic-line mt-5 w-20" />
            </Reveal>
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.id} delay={index * 0.04}>
                  <article className="relative ps-12">
                    <span className="absolute start-0 top-0 text-3xl font-semibold text-gold/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold text-text-dark">
                      {pickLocalized(value, locale, "title")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark-muted sm:text-base">
                      {pickLocalized(value, locale, "description")}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {timeline.length ? (
        <section className="section-space bg-[#12161c] text-text">
          <div className="container-page">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {copy.timeline}
              </h2>
              <div className="metallic-line mt-5 w-20" />
            </Reveal>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {timeline.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <li className="border-t border-gold/35 pt-6">
                    <p className="text-sm font-semibold tracking-wide text-gold">
                      {item.year}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold">
                      {pickLocalized(item, locale, "title")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {pickLocalized(item, locale, "description")}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </>
  );
}
