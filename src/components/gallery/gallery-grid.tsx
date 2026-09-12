"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { GalleryCategory, GalleryItem } from "@/types/database";
import { pickLocalized } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { t } from "@/lib/i18n/ui";

export function GalleryGrid({
  locale,
  items,
  categories,
}: {
  locale: Locale;
  items: GalleryItem[];
  categories: GalleryCategory[];
}) {
  const copy = t(locale);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (categoryId === "all") return items;
    return items.filter((item) => item.category_id === categoryId);
  }, [items, categoryId]);

  const tabs = useMemo(
    () => [
      { id: "all", label: copy.filterAll },
      ...categories.map((cat) => ({
        id: cat.id,
        label: pickLocalized(cat, locale, "name"),
      })),
    ],
    [categories, copy.filterAll, locale],
  );

  function handleFilter(id: string) {
    setCategoryId(id);
    setActiveIndex(null);
  }

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === null || filtered.length === 0
        ? i
        : (i - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);
  const next = useCallback(() => {
    setActiveIndex((i) =>
      i === null || filtered.length === 0 ? i : (i + 1) % filtered.length,
    );
  }, [filtered.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") (locale === "ar" ? next : prev)();
      if (e.key === "ArrowRight") (locale === "ar" ? prev : next)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev, locale]);

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading
          title={locale === "ar" ? "معرض المشاريع" : "Project Gallery"}
          description={
            locale === "ar"
              ? "استعرض أعمال الصلب والألمنيوم المنفذة."
              : "Explore delivered steel and aluminum works."
          }
        />

        <div className="mt-8 overflow-x-auto pb-1">
          <FilterTabs
            tabs={tabs}
            value={categoryId}
            onChange={handleFilter}
            ariaLabel={locale === "ar" ? "تصفية المعرض" : "Gallery filters"}
            className="min-w-max"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <div
            key={categoryId}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="group cursor-pointer overflow-hidden rounded-xl border border-steel/15 bg-white text-start shadow-sm transition hover:border-gold/40 focus-visible:outline-none"
                onClick={() => setActiveIndex(index)}
                aria-label={pickLocalized(item, locale, "title")}
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-surface-muted">
                  <Image
                    src={item.image_url}
                    alt={
                      pickLocalized(item, locale, "alt_text") ||
                      pickLocalized(item, locale, "title")
                    }
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={pickLocalized(active, locale, "title")}
          onClick={close}
        >
          <button
            type="button"
            className="absolute end-3 top-3 z-10 cursor-pointer rounded-md bg-white/10 p-2 text-white sm:end-4 sm:top-4"
            onClick={close}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            className="absolute start-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md bg-white/10 p-2 text-white sm:start-4"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="absolute end-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md bg-white/10 p-2 text-white sm:end-4"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
          <div
            className="relative h-[min(70vh,560px)] w-full max-w-5xl sm:h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image_url}
              alt={
                pickLocalized(active, locale, "alt_text") ||
                pickLocalized(active, locale, "title")
              }
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <p className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-3 text-center text-sm text-white">
              {pickLocalized(active, locale, "title")}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
