"use client";

import { useEffect, useId } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FeedbackTone = "success" | "error";

export function FeedbackPopup({
  open,
  tone,
  title,
  message,
  closeLabel,
  onClose,
  dir = "ltr",
}: {
  open: boolean;
  tone: FeedbackTone;
  title: string;
  message: string;
  closeLabel: string;
  onClose: () => void;
  dir?: "ltr" | "rtl";
}) {
  const titleId = useId();
  const descId = useId();
  const reduce = useReducedMotion();
  const isSuccess = tone === "success";

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
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
                isSuccess ? "bg-success" : "bg-danger",
              )}
              aria-hidden
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute end-3 top-3 rounded-md p-1.5 text-text-dark-muted transition hover:bg-surface hover:text-text-dark"
              aria-label={closeLabel}
            >
              <X size={18} aria-hidden />
            </button>

            <div className="px-6 pb-6 pt-8 text-center sm:px-8">
              <span
                className={cn(
                  "mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full",
                  isSuccess ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
                )}
              >
                {isSuccess ? (
                  <CheckCircle2 size={28} aria-hidden />
                ) : (
                  <CircleAlert size={28} aria-hidden />
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

              <Button
                type="button"
                onClick={onClose}
                className="mt-6 w-full sm:w-auto"
              >
                {closeLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
