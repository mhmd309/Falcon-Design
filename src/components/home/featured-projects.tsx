import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { GalleryItem } from "@/types/content";
import { cn, localizedPath, pickLocalized } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { ProjectMeta } from "@/components/gallery/project-meta";

export function FeaturedProjects({
  locale,
  items,
}: {
  locale: Locale;
  items: GalleryItem[];
}) {
  const copy = t(locale);

  return (
    <section
      className="section-space bg-surface"
      aria-labelledby="featured-projects-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            headingId="featured-projects-heading"
            title={copy.featuredProjects}
            description={copy.featuredProjectsDesc}
          />
        </Reveal>

        {!items.length ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 6).map((item, index) => {
                const title = pickLocalized(item, locale, "title");
                const alt = pickLocalized(item, locale, "alt_text") || title;
                const hasMeta =
                  Boolean(item.owner_name) ||
                  Boolean(item.consultant_name) ||
                  Boolean(item.project_contractor_name);

                return (
                  <Reveal key={item.id} delay={index * 0.05}>
                    <Link
                      href={localizedPath(locale, "/gallery")}
                      className={cn(
                        "group relative block aspect-[4/3] overflow-hidden rounded-xl border border-steel/15 bg-surface-muted shadow-sm transition duration-300",
                        "hover:scale-[1.02] hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(198,161,91,0.15)]",
                      )}
                    >
                      <Image
                        src={item.image_url}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized={item.source === "database"}
                        priority={index < 2}
                      />
                      <span
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,10,14,0.35)_100%)]"
                        aria-hidden
                      />
                      {hasMeta ? (
                        <span className="absolute inset-0 flex items-end">
                          <span
                            className="absolute inset-0 bg-gradient-to-t from-[#0b0d10]/95 via-[#0b0d10]/55 to-transparent"
                            aria-hidden
                          />
                          <span
                            className="absolute inset-0 opacity-80"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(198,161,91,0.18) 0%, transparent 42%, transparent 100%)",
                            }}
                            aria-hidden
                          />
                          <span className="relative z-[1] w-full p-3 sm:p-4">
                            <ProjectMeta locale={locale} item={item} />
                          </span>
                        </span>
                      ) : (
                        <span
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden
                        />
                      )}
                      <span className="absolute end-3 top-3 z-[2] rounded-full border border-gold/30 bg-gold/10 p-1.5 text-gold transition group-hover:bg-gold/20">
                        <ArrowUpRight size={16} aria-hidden />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-10 text-center">
              <Link
                href={localizedPath(locale, "/gallery")}
                className="inline-flex items-center justify-center rounded-md border border-gold/40 px-6 py-2.5 text-sm font-semibold text-text-dark transition hover:border-gold hover:bg-gold/10"
              >
                {copy.viewAll}
              </Link>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
