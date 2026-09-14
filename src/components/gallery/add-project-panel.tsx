"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Plus,
  LogOut,
  Loader2,
  X,
  ImagePlus,
  Upload,
} from "lucide-react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import type { GalleryItem, ProjectRecord } from "@/types/content";
import { cn } from "@/lib/utils";
import { mapProjectToGalleryItem, projectDbId } from "@/lib/projects";

type PanelMode = "closed" | "login" | "form";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export type AddProjectPanelHandle = {
  openEdit: (item: GalleryItem) => void;
};

export const AddProjectPanel = forwardRef<
  AddProjectPanelHandle,
  {
    locale: Locale;
    toolbarStart?: ReactNode;
    onAuthChange?: (authenticated: boolean) => void;
    onCreated: (item: GalleryItem) => void;
    onUpdated: (item: GalleryItem) => void;
  }
>(function AddProjectPanel(
  { locale, toolbarStart, onAuthChange, onCreated, onUpdated },
  ref,
) {
  const isAr = locale === "ar";
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authenticatedRef = useRef(false);
  const [mode, setMode] = useState<PanelMode>("closed");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pendingEditAfterLogin, setPendingEditAfterLogin] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [consultantName, setConsultantName] = useState("");
  const [projectContractorName, setProjectContractorName] = useState("");
  const [executingContractorName, setExecutingContractorName] = useState("");

  const isEditing = Boolean(editingItem);

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  const displayImage = previewUrl || existingImageUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        const data = (await res.json()) as { authenticated?: boolean };
        if (!cancelled) {
          const next = Boolean(data.authenticated);
          authenticatedRef.current = next;
          setAuthenticated(next);
          onAuthChange?.(next);
        }
      } catch {
        if (!cancelled) {
          authenticatedRef.current = false;
          setAuthenticated(false);
          onAuthChange?.(false);
        }
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onAuthChange]);

  function fillFromItem(item: GalleryItem | null) {
    if (!item) {
      setImage(null);
      setExistingImageUrl(null);
      setOwnerName("");
      setConsultantName("");
      setProjectContractorName("");
      setExecutingContractorName("");
      return;
    }
    setImage(null);
    setExistingImageUrl(item.image_url);
    setOwnerName(item.owner_name || "");
    setConsultantName(item.consultant_name || "");
    setProjectContractorName(item.project_contractor_name || "");
    setExecutingContractorName(item.executing_contractor_name || "");
  }

  const closePanel = useCallback(() => {
    setMode("closed");
    setError(null);
    setPassword("");
    setDragOver(false);
    setPendingEditAfterLogin(false);
    setEditingItem(null);
    setImage(null);
    setExistingImageUrl(null);
    setOwnerName("");
    setConsultantName("");
    setProjectContractorName("");
    setExecutingContractorName("");
  }, []);

  useImperativeHandle(ref, () => ({
    openEdit(item: GalleryItem) {
      setEditingItem(item);
      fillFromItem(item);
      setError(null);
      if (authenticatedRef.current) {
        setPendingEditAfterLogin(false);
        setMode("form");
      } else {
        setPendingEditAfterLogin(true);
        setMode("login");
      }
    },
  }));

  useEffect(() => {
    if (mode === "closed" || pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mode, pending, closePanel]);

  function openCreate() {
    setEditingItem(null);
    fillFromItem(null);
    setError(null);
    setPendingEditAfterLogin(false);
    setMode(authenticated ? "form" : "login");
  }

  function requestClose() {
    if (pending) return;
    closePanel();
  }

  function pickFile(file: File | null | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(isAr ? "الملف يجب أن يكون صورة" : "File must be an image");
      return;
    }
    setError(null);
    setImage(file);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError(isAr ? "الملف يجب أن يكون صورة" : "File must be an image");
        return;
      }
      setError(null);
      setImage(file);
    },
    [isAr],
  );

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
          data.error || (isAr ? "فشل تسجيل الدخول" : "Login failed"),
        );
        return;
      }
      authenticatedRef.current = true;
      setAuthenticated(true);
      onAuthChange?.(true);
      setPassword("");
      setMode("form");
      setPendingEditAfterLogin(false);
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
      authenticatedRef.current = false;
      setAuthenticated(false);
      onAuthChange?.(false);
      closePanel();
    } finally {
      setPending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEditing && !image) {
      setError(isAr ? "الصورة مطلوبة" : "Image is required");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const form = new FormData();
      if (image) form.set("image", image);
      form.set("ownerName", ownerName);
      form.set("consultantName", consultantName);
      form.set("projectContractorName", projectContractorName);
      form.set("executingContractorName", executingContractorName);

      const dbId = editingItem ? projectDbId(editingItem.id) : null;
      const res = await fetch(
        isEditing && dbId ? `/api/projects/${dbId}` : "/api/projects",
        {
          method: isEditing ? "PATCH" : "POST",
          credentials: "include",
          body: form,
        },
      );
      const data = (await res.json()) as {
        error?: string;
        project?: ProjectRecord;
      };

      if (!res.ok || !data.project) {
        setError(
          data.error ||
            (isAr
              ? isEditing
                ? "فشل تحديث المشروع"
                : "فشل حفظ المشروع"
              : isEditing
                ? "Failed to update project"
                : "Failed to save project"),
        );
        return;
      }

      const mapped = mapProjectToGalleryItem(data.project);
      if (isEditing) onUpdated(mapped);
      else onCreated(mapped);
      closePanel();
    } catch {
      setError(isAr ? "تعذر الاتصال بالخادم" : "Could not reach the server");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button type="button" onClick={openCreate} disabled={checkingAuth}>
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
        <div className="min-w-0 flex-1 overflow-x-auto pb-1 sm:flex sm:justify-end">
          {toolbarStart}
        </div>
      </div>

      {mode !== "closed" ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 p-3 sm:items-center sm:p-6"
          role="presentation"
          onClick={requestClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-steel/15 bg-card p-5 shadow-[0_24px_60px_rgba(18,22,28,0.28)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-md text-text-dark-muted transition hover:bg-surface-muted hover:text-text-dark"
              onClick={requestClose}
              aria-label={isAr ? "إغلاق" : "Close"}
              disabled={pending}
            >
              <X className="size-5" />
            </button>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4 pe-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                    Falcon Design
                  </p>
                  <h2
                    id={titleId}
                    className="mt-2 text-xl font-semibold text-text-dark"
                  >
                    {pendingEditAfterLogin
                      ? isAr
                        ? "تسجيل الدخول للتعديل"
                        : "Sign in to edit"
                      : isAr
                        ? "تسجيل الدخول للإضافة"
                        : "Sign in to add a project"}
                  </h2>
                </div>
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
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button type="submit" disabled={pending}>
                    {pending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    {isAr ? "دخول" : "Sign in"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={requestClose}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </form>
            ) : null}

            {mode === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-4 pe-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                    Falcon Design
                  </p>
                  <h2
                    id={titleId}
                    className="mt-2 text-xl font-semibold text-text-dark"
                  >
                    {isEditing
                      ? isAr
                        ? "تعديل المشروع"
                        : "Edit project"
                      : isAr
                        ? "بيانات المشروع الجديد"
                        : "New project details"}
                  </h2>
                </div>

                <div>
                  <Label>{isAr ? "الصورة" : "Image"}</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                    }}
                    onDrop={onDrop}
                    className={cn(
                      "relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-4 py-6 text-center transition",
                      dragOver
                        ? "border-gold bg-gold/10"
                        : "border-steel/30 bg-surface-muted/40 hover:border-gold/50 hover:bg-gold/5",
                    )}
                  >
                    {displayImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayImage}
                          alt=""
                          className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="relative z-10 space-y-2 text-white">
                          <Upload className="mx-auto size-6" aria-hidden />
                          <p className="text-sm font-semibold">
                            {isAr ? "تغيير الصورة" : "Change image"}
                          </p>
                          {image ? (
                            <p className="text-xs text-white/80">
                              {image.name} · {formatBytes(image.size)}
                            </p>
                          ) : (
                            <p className="text-xs text-white/80">
                              {isAr
                                ? "اتركها كما هي أو اختر صورة جديدة"
                                : "Keep current or choose a new one"}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <ImagePlus className="size-6" aria-hidden />
                        </span>
                        <p className="text-sm font-semibold text-text-dark">
                          {isAr
                            ? "اسحب الصورة هنا أو اضغط للاختيار"
                            : "Drag an image here or click to browse"}
                        </p>
                        <p className="mt-1.5 text-xs text-text-dark-muted">
                          JPG, PNG, WEBP, GIF ·{" "}
                          {isAr ? "حتى 5 ميجا" : "up to 5MB"}
                        </p>
                      </>
                    )}
                  </div>
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
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button type="submit" disabled={pending}>
                    {pending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    {isEditing
                      ? isAr
                        ? "حفظ التعديلات"
                        : "Save changes"
                      : isAr
                        ? "حفظ المشروع"
                        : "Save project"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={requestClose}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
});
