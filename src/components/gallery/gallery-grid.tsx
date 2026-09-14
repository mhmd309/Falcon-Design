"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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
import type { GalleryItem } from "@/types/content";
import { pickLocalized } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/section";
import {
  AddProjectPanel,
  type AddProjectPanelHandle,
} from "@/components/gallery/add-project-panel";
import { projectDbId, sortGalleryItems } from "@/lib/projects";
import { ConfirmPopup } from "@/components/ui/confirm-popup";
import { FeedbackPopup } from "@/components/ui/feedback-popup";
import { localizeApiError, t } from "@/lib/i18n/ui";

const PAGE_SIZE = 9;

function ProjectMeta({
  locale,
  item,
}: {
  locale: Locale;
  item: GalleryItem;
}) {
  const copy = t(locale);
  const rows = [
    { label: copy.owner, value: item.owner_name },
    { label: copy.consultant, value: item.consultant_name },
    { label: copy.mainContractor, value: item.project_contractor_name },
  ];

  const visible = rows.filter((row) => Boolean(row.value));
  if (!visible.length) return null;

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

export function GalleryGrid({
  locale,
  items: initialItems,
}: {
  locale: Locale;
  items: GalleryItem[];
}) {
  const copy = t(locale);
  const isAr = locale === "ar";
  const router = useRouter();
  const panelRef = useRef<AddProjectPanelHandle>(null);
  const [items, setItems] = useState(() => sortGalleryItems(initialItems));
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  function handleCreated(item: GalleryItem) {
    setItems((prev) => sortGalleryItems([item, ...prev.filter((p) => p.id !== item.id)]));
    setPage(1);
    setActiveIndex(null);
    router.refresh();
  }

  function handleUpdated(item: GalleryItem) {
    setItems((prev) =>
      sortGalleryItems(prev.map((p) => (p.id === item.id ? item : p))),
    );
    setActiveIndex(null);
    router.refresh();
  }

  function requestDelete(item: GalleryItem) {
    if (!projectDbId(item.id)) return;
    setActiveIndex(null);
    setPendingDelete(item);
  }

  async function confirmDelete() {
    const item = pendingDelete;
    if (!item) return;
    const dbId = projectDbId(item.id);
    if (!dbId) return;

    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/projects/${dbId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setFeedback({
          tone: "error",
          title: copy.deleteFailed,
          message:
            localizeApiError(locale, data.error) || copy.deleteFailedMessage,
        });
        return;
      }
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      setPendingDelete(null);
      setActiveIndex(null);
      router.refresh();
    } catch {
      setFeedback({
        tone: "error",
        title: copy.connectionError,
        message: copy.couldNotReachServer,
      });
    } finally {
      setDeletingId(null);
    }
  }

  const closeDeletePopup = useCallback(() => {
    if (deletingId) return;
    setPendingDelete(null);
  }, [deletingId]);

  const closeFeedback = useCallback(() => setFeedback(null), []);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <SectionHeading
            className="min-w-0 flex-1"
            title={copy.projectGallery}
            description={copy.projectGalleryDesc}
          />
          <AddProjectPanel
            ref={panelRef}
            locale={locale}
            onAuthChange={setIsAdmin}
            onCreated={handleCreated}
            onUpdated={handleUpdated}
          />
        </div>

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={copy.empty} />
          </div>
        ) : (
          <>
            <div
              key={page}
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
                      ) : null}
                    </span>
                  </button>

                  {isAdmin && item.source === "database" ? (
                    <div className="absolute start-2 top-2 z-10 flex gap-1.5">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition hover:bg-gold hover:text-on-gold"
                        aria-label={copy.edit}
                        title={copy.edit}
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
                        aria-label={copy.delete}
                        title={copy.delete}
                        disabled={deletingId === item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          void requestDelete(item);
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
            aria-label={copy.close}
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
            aria-label={copy.previous}
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
            aria-label={copy.next}
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
                  {copy.edit}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger"
                  disabled={deletingId === active.id}
                  onClick={() => requestDelete(active)}
                >
                  {deletingId === active.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  {copy.delete}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <ConfirmPopup
        open={Boolean(pendingDelete)}
        dir={isAr ? "rtl" : "ltr"}
        title={copy.confirmDelete}
        message={copy.confirmDeleteMessage}
        confirmLabel={copy.delete}
        cancelLabel={copy.cancel}
        pending={Boolean(deletingId)}
        onConfirm={() => void confirmDelete()}
        onCancel={closeDeletePopup}
      />

      <FeedbackPopup
        open={Boolean(feedback)}
        tone={feedback?.tone || "error"}
        title={feedback?.title || ""}
        message={feedback?.message || ""}
        closeLabel={copy.ok}
        onClose={closeFeedback}
        dir={isAr ? "rtl" : "ltr"}
      />
    </section>
  );
}
