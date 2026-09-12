import { ContactEmailsEditor } from "@/components/admin/forms/contact-emails-editor";
import { getContactEmails } from "@/lib/data/queries";

export default async function AdminContactEmailsPage() {
  const emails = await getContactEmails();
  return <ContactEmailsEditor emails={emails} />;
}
