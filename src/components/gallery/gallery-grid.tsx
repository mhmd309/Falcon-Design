"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import type { Locale } from "@/config/site";
import type { GalleryCategory, GalleryItem } from "@/types/content";
import { pickLocalized } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import { FilterTabs } from "@/components/ui/filter-tabs";
import {
  AddProjectPanel,
  type AddProjectPanelHandle,
} from "@/components/gallery/add-project-panel";
import { projectDbId, sortGalleryItems } from "@/lib/projects";
import { t } from "@/lib/i18n/ui";

const PAGE_SIZE = 9;

function ProjectMeta({
  locale,
  item,
  tone = "light",
}: {
  locale: Locale;
  item: GalleryItem;
  tone?: "light" | "dark";
}) {
  const rows =
    locale === "ar"
      ? [
          { label: "المالك", value: item.owner_name },
          { label: "الاستشاري", value: item.consultant_name },
          { label: "مقاول المشروع", value: item.project_contractor_name },
          {
            label: "المقاول المنفذ",
            value: item.executing_contractor_name,
          },
        ]
      : [
          { label: "Owner", value: item.owner_name },
          { label: "Consultant", value: item.consultant_name },
          { label: "Project contractor", value: item.project_contractor_name },
          {
            label: "Executing contractor",
            value: item.executing_contractor_name,
          },
        ];

  const visible = rows.filter((row) => Boolean(row.value));
  if (!visible.length) return null;

  if (tone === "dark") {
    return (
      <div className="w-full">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
          Falcon Design
        </p>
        <div className="metallic-line mt-2 mb-3 w-12" />
        <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2.5">
          {visible.map((row) => (
            <div
              key={row.label}
              className="rounded-md border border-white/10 bg-black/25 px-2.5 py-2 backdrop-blur-[2px]"
            >
              <dt className="text-[10px] font-medium tracking-wide text-gold-soft/90">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold leading-snug text-white">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <dl className="mt-4 grid gap-2 text-sm text-white/90 sm:grid-cols-2">
      {visible.map((row) => (
        <div key={row.label}>
          <dt className="text-xs tracking-wide text-white/55 uppercase">
            {row.label}
          </dt>
          <dd className="mt-0.5 font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function GalleryGrid({
  locale,
  items: initialItems,
  categories,
}: {
  locale: Locale;
  items: GalleryItem[];
  categories: GalleryCategory[];
}) {
  const copy = t(locale);
  const isAr = locale === "ar";
  const panelRef = useRef<AddProjectPanelHandle>(null);
  const [createdItems, setCreatedItems] = useState<GalleryItem[]>([]);
  const [updatedItems, setUpdatedItems] = useState<Record<string, GalleryItem>>(
    {},
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const deletedSet = useMemo(() => new Set(deletedIds), [deletedIds]);

  const items = useMemo(() => {
    const createdIds = new Set(createdItems.map((item) => item.id));
    const merged = [
      ...createdItems
        .filter((item) => !deletedSet.has(item.id))
        .map((item) => updatedItems[item.id] ?? item),
      ...initialItems
        .filter((item) => !deletedSet.has(item.id) && !createdIds.has(item.id))
        .map((item) => updatedItems[item.id] ?? item),
    ];
    return sortGalleryItems(merged);
  }, [createdItems, deletedSet, initialItems, updatedItems]);

  const filtered = useMemo(() => {
    if (categoryId === "all") return items;
    return items.filter((item) => item.category_id === categoryId);
  }, [items, categoryId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

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
    setPage(1);
    setActiveIndex(null);
  }

  function handleCreated(item: GalleryItem) {
    setCreatedItems((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
    setDeletedIds((prev) => prev.filter((id) => id !== item.id));
    setCategoryId("all");
    setPage(1);
    setActiveIndex(null);
  }

  function handleUpdated(item: GalleryItem) {
    setUpdatedItems((prev) => ({ ...prev, [item.id]: item }));
    setCreatedItems((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.map((p) => (p.id === item.id ? item : p))
        : prev,
    );
    setActiveIndex(null);
  }

  async function handleDelete(item: GalleryItem) {
    const dbId = projectDbId(item.id);
    if (!dbId) return;

    const confirmed = window.confirm(
      isAr
        ? "هل تريد حذف هذا المشروع؟"
        : "Delete this project?",
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/projects/${dbId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(
          data.error ||
            (isAr ? "فشل حذف المشروع" : "Failed to delete project"),
        );
        return;
      }
      setDeletedIds((prev) => [...prev, item.id]);
      setCreatedItems((prev) => prev.filter((p) => p.id !== item.id));
      setUpdatedItems((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      setActiveIndex(null);
    } catch {
      window.alert(isAr ? "تعذر الاتصال بالخادم" : "Could not reach the server");
    } finally {
      setDeletingId(null);
    }
  }

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === null || pageItems.length === 0
        ? i
        : (i - 1 + pageItems.length) % pageItems.length,
    );
  }, [pageItems.length]);
  const next = useCallback(() => {
    setActiveIndex((i) =>
      i === null || pageItems.length === 0 ? i : (i + 1) % pageItems.length,
    );
  }, [pageItems.length]);

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

  const active = activeIndex !== null ? pageItems[activeIndex] : null;
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

        <AddProjectPanel
          ref={panelRef}
          locale={locale}
          onAuthChange={setIsAdmin}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          toolbarStart={
            <FilterTabs
              tabs={tabs}
              value={categoryId}
              onChange={handleFilter}
              ariaLabel={locale === "ar" ? "تصفية المعرض" : "Gallery filters"}
              className="min-w-max"
            />
          }
        />

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <>
            <div
              key={`${categoryId}-${page}`}
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-steel/15 bg-card text-start shadow-[0_10px_30px_rgba(18,22,28,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-[0_18px_40px_rgba(18,22,28,0.12)]"
                >
                  <button
                    type="button"
                    className="block w-full cursor-pointer text-start focus-visible:outline-none"
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
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                        unoptimized={item.source === "database"}
                      />
                      {/* ambient vignette always on */}
                      <span
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,10,14,0.35)_100%)]"
                        aria-hidden
                      />
                      {item.source === "database" ? (
                        <span className="absolute inset-0 flex items-end opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
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
                            <ProjectMeta
                              locale={locale}
                              item={item}
                              tone="dark"
                            />
                          </span>
                        </span>
                      ) : (
                        <span
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100"
                          aria-hidden
                        />
                      )}
                    </span>
                  </button>

                  {isAdmin && item.source === "database" ? (
                    <div className="absolute start-2 top-2 z-10 flex gap-1.5">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition hover:bg-gold hover:text-on-gold"
                        aria-label={isAr ? "تعديل" : "Edit"}
                        title={isAr ? "تعديل" : "Edit"}
                        onClick={(e) => {
                          e.stopPropagation();
                          panelRef.current?.openEdit(item);
                        }}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition hover:bg-danger"
                        aria-label={isAr ? "حذف" : "Delete"}
                        title={isAr ? "حذف" : "Delete"}
                        disabled={deletingId === item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDelete(item);
                        }}
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, Math.min(p, totalPages) - 1));
                    setActiveIndex(null);
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
                    setActiveIndex(null);
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
            className="relative flex w-full max-w-5xl flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[min(55vh,480px)] w-full sm:h-[65vh]">
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
                unoptimized={active.source === "database"}
              />
            </div>
            <ProjectMeta locale={locale} item={active} />
            {isAdmin && active.source === "database" ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-on-gold"
                  onClick={() => {
                    setActiveIndex(null);
                    panelRef.current?.openEdit(active);
                  }}
                >
                  <Pencil className="size-4" />
                  {isAr ? "تعديل" : "Edit"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger"
                  disabled={deletingId === active.id}
                  onClick={() => void handleDelete(active)}
                >
                  {deletingId === active.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  {isAr ? "حذف" : "Delete"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
