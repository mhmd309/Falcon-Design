import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Service } from "@/types/database";
import { cn, localizedPath, pickLocalized } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, EmptyState } from "@/components/ui/section";

export function FeaturedServices({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const copy = t(locale);

  if (!services.length) {
    return (
      <section className="section-space">
        <div className="container-page">
          <EmptyState title={copy.empty} />
        </div>
      </section>
    );
  }

  return (
    <section className="section-space" aria-labelledby="featured-services-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={copy.featuredServices}
            description={
              locale === "ar"
                ? "حلول صلب وألمنيوم مختارة بعناية لمشاريعكم."
                : "Hand-picked steel and aluminum solutions for your projects."
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const title = pickLocalized(service, locale, "title");
            const shortDesc = pickLocalized(service, locale, "short_description");
            const alt = pickLocalized(service, locale, "alt_text") || title;

            return (
              <Reveal key={service.id} delay={index * 0.06}>
                <article
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-xl border border-steel/15 bg-card shadow-sm transition duration-300",
                    "hover:scale-[1.02] hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(198,161,91,0.12)]",
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-steel/20 to-steel-dark/30" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
                    {shortDesc ? (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-dark-muted">
                        {shortDesc}
                      </p>
                    ) : null}
                    <Link
                      href={localizedPath(locale, "/services")}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition hover:text-gold-soft"
                    >
                      {copy.learnMore}
                      <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href={localizedPath(locale, "/services")}
            className="inline-flex items-center justify-center rounded-md border border-gold/40 px-6 py-2.5 text-sm font-semibold text-text-dark transition hover:border-gold hover:bg-gold/10"
          >
            {copy.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
