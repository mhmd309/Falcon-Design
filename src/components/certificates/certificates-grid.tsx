"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Certificate } from "@/types/database";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { pickLocalized } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";

const PAGE_SIZE = 6;

export function CertificatesGrid({
  locale,
  items,
  title,
  description,
}: {
  locale: Locale;
  items: Certificate[];
  title?: string | null;
  description?: string | null;
}) {
  const copy = t(locale);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Certificate | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <section className="section-space" aria-labelledby="certificates-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={
              title ||
              (locale === "ar"
                ? "الشهادات والاعتمادات"
                : "Certificates & Accreditations")
            }
            description={description || undefined}
          />
        </Reveal>

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <>
            <div
              key={page}
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <button
                    type="button"
                    className="group w-full cursor-pointer overflow-hidden rounded-xl border border-steel/15 bg-card text-start shadow-sm transition hover:border-gold/40 focus-visible:outline-none"
                    onClick={() => setActive(item)}
                    aria-label={pickLocalized(item, locale, "title")}
                  >
                    <span className="relative block aspect-[2/3] overflow-hidden bg-white">
                      <Image
                        src={item.image_url}
                        alt={
                          pickLocalized(item, locale, "alt_text") ||
                          pickLocalized(item, locale, "title")
                        }
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-contain transition duration-500 group-hover:scale-[1.02]"
                      />
                    </span>
                    <span className="block space-y-1 border-t border-steel/15 bg-card px-4 py-4">
                      <span className="block text-sm font-semibold text-text-dark">
                        {pickLocalized(item, locale, "title")}
                      </span>
                      {(item.issuer_ar || item.issuer_en || item.year) && (
                        <span className="block text-xs text-text-dark-muted">
                          {[pickLocalized(item, locale, "issuer"), item.year]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    setActive(null);
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
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    setActive(null);
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

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={pickLocalized(active, locale, "title")}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute end-3 top-3 z-10 cursor-pointer rounded-md bg-white/10 p-2 text-white sm:end-4 sm:top-4"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-bg-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[2/3] w-full max-h-[78vh]">
              <Image
                src={active.image_url}
                alt={
                  pickLocalized(active, locale, "alt_text") ||
                  pickLocalized(active, locale, "title")
                }
                fill
                sizes="100vw"
                className="object-contain p-6"
                priority
              />
            </div>
            <div className="border-t border-white/10 px-5 py-4 text-center text-white">
              <p className="text-base font-semibold">
                {pickLocalized(active, locale, "title")}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {pickLocalized(active, locale, "description")}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
