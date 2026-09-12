"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { t } from "@/lib/i18n/ui";
import type { Locale } from "@/config/site";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, toggleTheme } = useTheme();
  const copy = t(locale);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:border-gold/50 hover:text-gold"
      aria-label={isDark ? copy.themeLight : copy.themeDark}
      title={isDark ? copy.themeLight : copy.themeDark}
    >
      {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}
