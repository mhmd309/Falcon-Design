import { ContactEditor } from "@/components/admin/forms/contact-editor";
import { getAdminContactMessages, getContactSettings } from "@/lib/data/queries";
import type { ContactMessage } from "@/types/database";

export default async function AdminContactPage() {
  const [settings, rawMessages] = await Promise.all([
    getContactSettings(),
    getAdminContactMessages(),
  ]);

  const messages = rawMessages as ContactMessage[];

  return <ContactEditor settings={settings} messages={messages} />;
}
