import Image from "next/image";
import type { Locale } from "@/config/site";
import type {
  CoreValue,
  SiteSection,
  TeamMember,
  TimelineItem,
} from "@/types/database";
import { pickLocalized } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/motion";
import { t } from "@/lib/i18n/ui";

export function AboutContent({
  locale,
  intro,
  vision,
  mission,
  values,
  timeline,
  team,
}: {
  locale: Locale;
  intro: SiteSection | null;
  vision: SiteSection | null;
  mission: SiteSection | null;
  values: CoreValue[];
  timeline: TimelineItem[];
  team: TeamMember[];
}) {
  const copy = t(locale);

  return (
    <>
      <section className="section-space">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              title={
                intro
                  ? pickLocalized(intro, locale, "title")
                  : locale === "ar"
                    ? "من نحن"
                    : "About Us"
              }
              description={
                intro ? pickLocalized(intro, locale, "subtitle") : undefined
              }
            />
            <p className="mt-6 text-base leading-relaxed text-text-dark-muted md:text-lg">
              {intro ? pickLocalized(intro, locale, "description") : null}
            </p>
          </Reveal>
          {intro?.image_url ? (
            <Reveal delay={0.08}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={intro.image_url}
                  alt={
                    pickLocalized(intro, locale, "alt_text") ||
                    pickLocalized(intro, locale, "title")
                  }
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="border-y border-steel/15 bg-bg text-text">
        <div className="container-page grid gap-8 py-14 md:grid-cols-2">
          {vision ? (
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {copy.vision}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                {pickLocalized(vision, locale, "title")}
              </h2>
              <p className="mt-4 leading-relaxed text-text-muted">
                {pickLocalized(vision, locale, "description")}
              </p>
            </Reveal>
          ) : null}
          {mission ? (
            <Reveal delay={0.06}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {copy.mission}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                {pickLocalized(mission, locale, "title")}
              </h2>
              <p className="mt-4 leading-relaxed text-text-muted">
                {pickLocalized(mission, locale, "description")}
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {values.length ? (
        <section className="section-space">
          <div className="container-page">
            <SectionHeading title={copy.ourValues} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value, index) => (
                <Reveal key={value.id} delay={index * 0.04}>
                  <article className="h-full rounded-xl border border-steel/15 bg-white p-5">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {pickLocalized(value, locale, "title")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark-muted">
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
        <section className="section-space bg-surface-muted/40">
          <div className="container-page">
            <SectionHeading title={copy.timeline} />
            <ol className="mt-10 space-y-6 border-s border-gold/40 ps-6">
              {timeline.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.04}>
                  <li className="relative">
                    <span className="absolute -start-[1.9rem] top-1.5 size-3 rounded-full bg-gold" />
                    <p className="text-sm font-semibold text-gold">{item.year}</p>
                    <h3 className="mt-1 text-lg font-semibold text-text-dark">
                      {pickLocalized(item, locale, "title")}
                    </h3>
                    <p className="mt-2 text-sm text-text-dark-muted">
                      {pickLocalized(item, locale, "description")}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {team.length ? (
        <section className="section-space">
          <div className="container-page">
            <SectionHeading title={copy.team} />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <Reveal key={member.id} delay={index * 0.04}>
                  <article className="rounded-xl border border-steel/15 bg-white p-5">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {pickLocalized(member, locale, "name")}
                    </h3>
                    <p className="mt-1 text-sm text-gold">
                      {pickLocalized(member, locale, "position")}
                    </p>
                    <p className="mt-3 text-sm text-text-dark-muted">
                      {pickLocalized(member, locale, "bio")}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
