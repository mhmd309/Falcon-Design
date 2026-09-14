"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Service, SiteSection } from "@/types/content";
import { pickLocalized } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Input } from "@/components/ui/form";
import { t } from "@/lib/i18n/ui";

const PAGE_SIZE = 6;

export function ServicesGrid({
  locale,
  services,
  intro,
}: {
  locale: Locale;
  services: Service[];
  intro: SiteSection | null;
}) {
  const copy = t(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const tabs = [
    { id: "all", label: copy.filterAll },
    { id: "steel", label: copy.steel },
    { id: "aluminum", label: copy.aluminum },
  ];

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;
      const haystack = [
        pickLocalized(service, locale, "title"),
        pickLocalized(service, locale, "short_description"),
        pickLocalized(service, locale, "description"),
        service.category,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [services, category, query, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  function handleCategoryChange(next: string) {
    setCategory(next);
    setPage(1);
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
  }

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading
          title={
            intro ? pickLocalized(intro, locale, "title") : copy.ourServices
          }
          description={
            intro ? pickLocalized(intro, locale, "description") : undefined
          }
        />

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="overflow-x-auto pb-1">
            <FilterTabs
              tabs={tabs}
              value={category}
              onChange={handleCategoryChange}
              ariaLabel={copy.serviceFilters}
              className="min-w-max"
            />
          </div>
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.search}
            className="w-full lg:max-w-xs"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <>
            <div
              key={`${category}-${query}-${currentPage}`}
              className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {pageItems.map((service) => (
                <article
                  key={service.id}
                  className="overflow-hidden rounded-xl border border-steel/15 bg-card shadow-sm"
                >
                  <div className="relative aspect-[16/10] bg-surface-muted">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={
                          pickLocalized(service, locale, "alt_text") ||
                          pickLocalized(service, locale, "title")
                        }
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                        className={
                          service.image_url.endsWith(".svg")
                            ? "object-contain p-3"
                            : "object-cover"
                        }
                      />
                    ) : null}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg font-semibold text-text-dark">
                      {pickLocalized(service, locale, "title")}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-dark-muted">
                      {pickLocalized(service, locale, "description") ||
                        pickLocalized(service, locale, "short_description")}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, Math.min(p, totalPages) - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-steel/25 bg-card px-4 py-2.5 text-sm font-semibold text-text-dark transition hover:border-gold/50 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight
                    size={16}
                    className={locale === "ar" ? "" : "rotate-180"}
                    aria-hidden
                  />
                  {copy.previous}
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setPage((p) =>
                      Math.min(totalPages, Math.min(p, totalPages) + 1),
                    );
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-steel/25 bg-card px-4 py-2.5 text-sm font-semibold text-text-dark transition hover:border-gold/50 disabled:pointer-events-none disabled:opacity-40"
                >
                  {copy.next}
                  <ChevronLeft
                    size={16}
                    className={locale === "ar" ? "" : "rotate-180"}
                    aria-hidden
                  />
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
