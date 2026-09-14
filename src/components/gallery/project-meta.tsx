import type { Locale } from "@/config/site";
import type { GalleryItem } from "@/types/content";
import { t } from "@/lib/i18n/ui";

export function ProjectMeta({
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
    <div className="min-w-0 w-full">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
        Falcon Design
      </p>
      <div className="metallic-line mt-2 mb-3 w-12" />
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
        {visible.map((row) => (
          <div
            key={row.label}
            className="min-w-0 rounded-md border border-white/10 bg-black/25 px-2.5 py-2 backdrop-blur-[2px]"
          >
            <dt className="text-[10px] font-medium tracking-wide text-gold-soft/90">
              {row.label}
            </dt>
            <dd className="mt-0.5 truncate text-sm font-semibold leading-snug text-white">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
