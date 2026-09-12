"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/config/site";
import type { Service, SiteSection } from "@/types/database";
import { localizedPath, pickLocalized } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Input } from "@/components/ui/form";
import { t } from "@/lib/i18n/ui";

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

  const tabs = [
    { id: "all", label: copy.filterAll },
    {
      id: "steel",
      label: locale === "ar" ? "صلب" : "Steel",
    },
    {
      id: "aluminum",
      label: locale === "ar" ? "ألمنيوم" : "Aluminum",
    },
  ];

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;
      const haystack = [
        pickLocalized(service, locale, "title"),
        pickLocalized(service, locale, "short_description"),
        service.category,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [services, category, query, locale]);

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading
          title={
            intro
              ? pickLocalized(intro, locale, "title")
              : locale === "ar"
                ? "خدماتنا"
                : "Our Services"
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
              onChange={setCategory}
              ariaLabel={locale === "ar" ? "تصفية الخدمات" : "Service filters"}
              className="min-w-max"
            />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "ar" ? "بحث..." : "Search…"}
            aria-label={locale === "ar" ? "بحث" : "Search"}
            className="w-full lg:max-w-xs"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <div
            key={category + query}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-xl border border-steel/15 bg-white shadow-sm"
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
                      className="object-cover"
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
        )}

        <div className="mt-12 rounded-2xl border border-gold/25 bg-bg p-6 text-text sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {copy.requestQuote}
          </h2>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            {intro ? pickLocalized(intro, locale, "subtitle") : null}
          </p>
          <Link
            href={localizedPath(locale, "/contact")}
            className="mt-6 inline-flex cursor-pointer rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-text-dark transition hover:bg-gold-soft"
          >
            {copy.navCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
