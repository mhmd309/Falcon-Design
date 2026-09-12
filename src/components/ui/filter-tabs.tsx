"use client";

import { cn } from "@/lib/utils";

export type FilterTab = {
  id: string;
  label: string;
};

export function FilterTabs({
  tabs,
  value,
  onChange,
  className,
  ariaLabel = "Filters",
}: {
  tabs: FilterTab[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-md px-3.5 py-2 text-sm font-medium transition",
              active
                ? "bg-bg text-gold shadow-sm"
                : "border border-steel/25 bg-white text-text-dark hover:border-gold/40 hover:text-steel-dark",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function AdminTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: FilterTab[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      className="mb-6 flex flex-wrap gap-2 border-b border-steel/20 pb-2"
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-md px-4 py-2 text-sm font-medium capitalize transition",
              active
                ? "bg-gold/15 text-gold-soft"
                : "text-text-muted hover:bg-bg-soft hover:text-text",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
