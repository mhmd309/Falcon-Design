import { SettingsEditor } from "@/components/admin/forms/settings-editor";
import { getSiteSettings } from "@/lib/data/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsEditor settings={settings} />;
}
