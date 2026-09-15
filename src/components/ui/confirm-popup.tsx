"use client";

import { useEffect, useId } from "react";
import { LogOut, Trash2, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConfirmPopup({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
  onCancel,
  dir = "ltr",
  intent = "danger",
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  dir?: "ltr" | "rtl";
  intent?: "danger" | "logout";
}) {
  const titleId = useId();
  const descId = useId();
  const reduce = useReducedMotion();
  const isLogout = intent === "logout";

  useEffect(() => {
    if (!open || pending) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, pending, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label={cancelLabel}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={pending ? undefined : onCancel}
            disabled={pending}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            dir={dir}
            className="shadow-float relative w-full max-w-md overflow-hidden rounded-2xl border border-steel/20 bg-card"
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-1",
                isLogout ? "bg-steel" : "bg-danger",
              )}
              aria-hidden
            />

            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="absolute end-3 top-3 rounded-md p-1.5 text-text-dark-muted transition hover:bg-surface hover:text-text-dark disabled:opacity-50"
              aria-label={cancelLabel}
            >
              <X size={18} aria-hidden />
            </button>

            <div className="px-6 pb-6 pt-8 text-center sm:px-8">
              <span
                className={cn(
                  "mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full",
                  isLogout
                    ? "bg-steel/15 text-steel-dark"
                    : "bg-danger/15 text-danger",
                )}
              >
                {isLogout ? (
                  <LogOut size={26} aria-hidden />
                ) : (
                  <Trash2 size={26} aria-hidden />
                )}
              </span>

              <h3
                id={titleId}
                className="text-xl font-semibold tracking-tight text-text-dark"
              >
                {title}
              </h3>
              <p
                id={descId}
                className="mt-3 text-sm leading-relaxed text-text-dark-muted"
              >
                {message}
              </p>

              <div className="metallic-line mx-auto mt-5 w-16" />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={pending}
                  className="sm:min-w-28"
                >
                  {cancelLabel}
                </Button>
                <Button
                  type="button"
                  variant={isLogout ? "secondary" : "danger"}
                  onClick={onConfirm}
                  disabled={pending}
                  className={cn(
                    "sm:min-w-28",
                    isLogout &&
                      "border-steel/30 bg-surface text-text-dark hover:border-steel/50 hover:bg-surface-muted",
                  )}
                >
                  {pending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
