import { getDashboardStats } from "@/lib/data/queries";
import { Image, Mail, Star, Wrench } from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Services", value: stats.services, icon: Wrench },
    { label: "Gallery Items", value: stats.gallery, icon: Image },
    { label: "Contact Messages", value: stats.messages, icon: Mail },
    { label: "Active Services", value: stats.activeServices, icon: Wrench },
    { label: "Featured Projects", value: stats.featuredProjects, icon: Star },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Overview of Falcon Design site content
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-steel/20 bg-bg-soft p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{label}</p>
                <p className="mt-2 text-3xl font-bold text-gold">{value}</p>
              </div>
              <Icon className="h-8 w-8 text-steel" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
