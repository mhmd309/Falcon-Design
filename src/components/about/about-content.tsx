import type { Locale } from "@/config/site";
import type {
  CoreValue,
  SiteSection,
  TimelineItem,
} from "@/types/content";
import { pickLocalized } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section";
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
  const subtitle = intro ? pickLocalized(intro, locale, "subtitle") : undefined;
  const description = intro
    ? pickLocalized(intro, locale, "description")
    : undefined;

  return (
    <>
      <section className="section-space">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Falcon Design"
              title={title}
              description={subtitle}
            />
            {description ? (
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-dark-muted sm:text-lg md:leading-8">
                {description}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {(vision || mission) && (
        <section className="section-space bg-bg text-text">
          <div className="container-page grid gap-10 md:grid-cols-2 md:gap-0">
            {vision ? (
              <Reveal>
                <div className="md:border-e md:border-steel/15 md:pe-12">
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
                <div className="md:ps-12">
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
        <section className="section-space bg-bg-elevated text-text">
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
