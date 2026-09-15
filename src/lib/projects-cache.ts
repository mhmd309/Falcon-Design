import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";

export function revalidateProjectPages() {
  for (const locale of siteConfig.locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/gallery`);
  }
}
