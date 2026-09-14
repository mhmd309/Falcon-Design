"use client";

import { useEffect, useState } from "react";
import { Plus, LogOut, Loader2 } from "lucide-react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import type { GalleryItem } from "@/types/content";

type PanelMode = "closed" | "login" | "form";

function mapCreatedProject(project: {
  id: string;
  imageUrl: string;
  clientName: string;
  ownerName: string;
  consultantName: string;
  projectContractorName: string;
  executingContractorName: string;
}): GalleryItem {
  const title = project.clientName;
  return {
    id: `db-${project.id}`,
    category_id: null,
    title_ar: title,
    title_en: title,
    description_ar: null,
    description_en: null,
    image_url: project.imageUrl,
    alt_text_ar: title,
    alt_text_en: title,
    is_featured: true,
    source: "database",
    client_name: project.clientName,
    owner_name: project.ownerName,
    consultant_name: project.consultantName,
    project_contractor_name: project.projectContractorName,
    executing_contractor_name: project.executingContractorName,
  };
}

export function AddProjectPanel({
  locale,
  onCreated,
}: {
  locale: Locale;
  onCreated: (item: GalleryItem) => void;
}) {
  const isAr = locale === "ar";
  const [mode, setMode] = useState<PanelMode>("closed");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [clientName, setClientName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [consultantName, setConsultantName] = useState("");
  const [projectContractorName, setProjectContractorName] = useState("");
  const [executingContractorName, setExecutingContractorName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        const data = (await res.json()) as { authenticated?: boolean };
        if (!cancelled) setAuthenticated(Boolean(data.authenticated));
      } catch {
        if (!cancelled) setAuthenticated(false);
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openPanel() {
    setError(null);
    setMode(authenticated ? "form" : "login");
  }

  function closePanel() {
    setMode("closed");
    setError(null);
    setPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(
          data.error ||
            (isAr ? "فشل تسجيل الدخول" : "Login failed"),
        );
        return;
      }
      setAuthenticated(true);
      setPassword("");
      setMode("form");
    } catch {
      setError(isAr ? "تعذر الاتصال بالخادم" : "Could not reach the server");
    } finally {
      setPending(false);
    }
  }

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthenticated(false);
      setMode("closed");
    } finally {
      setPending(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError(isAr ? "الصورة مطلوبة" : "Image is required");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("image", image);
      form.set("clientName", clientName);
      form.set("ownerName", ownerName);
      form.set("consultantName", consultantName);
      form.set("projectContractorName", projectContractorName);
      form.set("executingContractorName", executingContractorName);

      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = (await res.json()) as {
        error?: string;
        project?: Parameters<typeof mapCreatedProject>[0];
      };

      if (!res.ok || !data.project) {
        setError(
          data.error ||
            (isAr ? "فشل حفظ المشروع" : "Failed to save project"),
        );
        return;
      }

      onCreated(mapCreatedProject(data.project));
      setImage(null);
      setClientName("");
      setOwnerName("");
      setConsultantName("");
      setProjectContractorName("");
      setExecutingContractorName("");
      setMode("closed");
    } catch {
      setError(isAr ? "تعذر الاتصال بالخادم" : "Could not reach the server");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={openPanel} disabled={checkingAuth}>
          <Plus className="size-4" aria-hidden />
          {isAr ? "إضافة مشروع جديد" : "Add new project"}
        </Button>
        {authenticated ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={pending}
          >
            <LogOut className="size-4" aria-hidden />
            {isAr ? "تسجيل الخروج" : "Log out"}
          </Button>
        ) : null}
      </div>

      {mode === "login" ? (
        <form
          onSubmit={handleLogin}
          className="mt-6 max-w-md space-y-4 rounded-xl border border-steel/15 bg-card p-5"
        >
          <p className="text-sm font-semibold text-text-dark">
            {isAr ? "تسجيل الدخول للإضافة" : "Sign in to add a project"}
          </p>
          <div>
            <Label htmlFor="admin-email">{isAr ? "البريد" : "Email"}</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <Label htmlFor="admin-password">
              {isAr ? "كلمة المرور" : "Password"}
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
            />
          </div>
          <FieldError message={error || undefined} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isAr ? "دخول" : "Sign in"}
            </Button>
            <Button type="button" variant="ghost" onClick={closePanel}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      ) : null}

      {mode === "form" ? (
        <form
          onSubmit={handleCreate}
          className="mt-6 max-w-xl space-y-4 rounded-xl border border-steel/15 bg-card p-5"
        >
          <p className="text-sm font-semibold text-text-dark">
            {isAr ? "بيانات المشروع الجديد" : "New project details"}
          </p>

          <div>
            <Label htmlFor="project-image">{isAr ? "الصورة" : "Image"}</Label>
            <Input
              id="project-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="client-name">
              {isAr ? "اسم العميل" : "Client name"}
            </Label>
            <Input
              id="client-name"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="owner-name">
              {isAr ? "اسم المالك" : "Owner name"}
            </Label>
            <Input
              id="owner-name"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="consultant-name">
              {isAr ? "اسم الاستشاري" : "Consultant name"}
            </Label>
            <Input
              id="consultant-name"
              required
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="project-contractor">
              {isAr ? "اسم مقاول المشروع" : "Project contractor"}
            </Label>
            <Input
              id="project-contractor"
              required
              value={projectContractorName}
              onChange={(e) => setProjectContractorName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="executing-contractor">
              {isAr
                ? "اسم المقاول المنفذ للمشروع"
                : "Executing contractor"}
            </Label>
            <Input
              id="executing-contractor"
              required
              value={executingContractorName}
              onChange={(e) => setExecutingContractorName(e.target.value)}
            />
          </div>

          <FieldError message={error || undefined} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isAr ? "حفظ المشروع" : "Save project"}
            </Button>
            <Button type="button" variant="ghost" onClick={closePanel}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
