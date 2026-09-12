"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { t } from "@/lib/i18n/ui";
import type { Locale } from "@/config/site";

export function ScrollToTop({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 end-5 z-[70] inline-flex items-center gap-2 rounded-md border border-gold/40 bg-bg px-3.5 py-2.5 text-sm font-semibold text-text shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:border-gold hover:bg-bg-elevated sm:bottom-7 sm:end-7"
      aria-label={copy.backToTop}
    >
      <ArrowUp size={16} aria-hidden />
      <span className="hidden sm:inline">{copy.backToTop}</span>
    </button>
  );
}
