import { ServicesEditor } from "@/components/admin/forms/services-editor";
import { getAdminServices } from "@/lib/data/queries";

export default async function AdminServicesPage() {
  const services = await getAdminServices();
  return <ServicesEditor services={services} />;
}
