import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { GalleryItem } from "@/types/database";
import { cn, localizedPath, pickLocalized } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, EmptyState } from "@/components/ui/section";

export function FeaturedProjects({
  locale,
  items,
}: {
  locale: Locale;
  items: GalleryItem[];
}) {
  const copy = t(locale);

  if (!items.length) {
    return (
      <section className="section-space bg-surface">
        <div className="container-page">
          <EmptyState title={copy.empty} />
        </div>
      </section>
    );
  }

  return (
    <section
      className="section-space bg-surface"
      aria-labelledby="featured-projects-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={copy.featuredProjects}
            description={
              locale === "ar"
                ? "نماذج من مشاريعنا المنفذة في الصلب والألمنيوم."
                : "A selection of delivered steel and aluminum projects."
            }
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item, index) => {
            const title = pickLocalized(item, locale, "title");
            const alt = pickLocalized(item, locale, "alt_text") || title;

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
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-end gap-3 p-4 md:p-5">
                    <span className="rounded-full border border-gold/30 bg-gold/10 p-1.5 text-gold transition group-hover:bg-gold/20">
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </div>
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
      </div>
    </section>
  );
}
