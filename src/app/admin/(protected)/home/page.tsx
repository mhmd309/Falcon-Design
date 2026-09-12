import { HomeEditor } from "@/components/admin/forms/home-editor";
import {
  getAdminPage,
  getAdminSection,
  getAdminStatistics,
} from "@/lib/data/queries";

export default async function AdminHomePage() {
  const [hero, cta, page, statistics] = await Promise.all([
    getAdminSection("home", "hero"),
    getAdminSection("home", "cta"),
    getAdminPage("home"),
    getAdminStatistics(),
  ]);

  return (
    <HomeEditor
      hero={hero}
      cta={cta}
      page={page}
      statistics={statistics}
    />
  );
}
