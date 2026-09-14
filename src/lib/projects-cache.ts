import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";

/** Invalidate project listing surfaces after create/update/delete. */
export function revalidateProjectPages() {
  for (const locale of siteConfig.locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/gallery`);
  }
}
