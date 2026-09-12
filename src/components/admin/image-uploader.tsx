"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { v } from "@/lib/i18n/validation";
import { cn, isSupabaseConfigured } from "@/lib/utils";
import { imageUploadMetaSchema } from "@/lib/validation/schemas";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: "gallery" | "site-media";
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  bucket = "gallery",
  disabled,
  className,
  label = "Image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();
  const messages = v(siteConfig.defaultLocale);

  async function handleFile(file: File) {
    setError(null);
    const parsed = imageUploadMetaSchema.safeParse({
      mimeType: file.type,
      size: file.size,
    });
    if (!parsed.success) {
      setError(messages.invalidFile);
      return;
    }

    if (!configured) {
      setError(messages.uploadRequiresSupabase);
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${bucket}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setError(messages.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <span className="block text-sm font-medium text-text-dark [.admin-shell_&]:text-text">{label}</span>

      {!configured && (
        <p className="rounded-md border border-steel/20 bg-surface-muted px-3 py-2 text-xs text-text-dark-muted">
          Image upload requires Supabase. You can paste a URL manually below.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={disabled || uploading || !configured}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || uploading || !configured}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {value && (
        <div className="overflow-hidden rounded-md border border-steel/20 bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="max-h-48 w-full object-cover" />
        </div>
      )}

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://… or /gallery/01.jpeg"
        className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 text-sm text-text-dark placeholder:text-text-dark-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}
