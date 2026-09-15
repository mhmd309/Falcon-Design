/** Shared project image upload rules. */

export const MAX_PROJECT_IMAGE_BYTES = 15 * 1024 * 1024;

export const PROJECT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
] as const;

const ALLOWED_MIME = new Set<string>(PROJECT_IMAGE_MIME_TYPES);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

export function isAllowedProjectImage(file: {
  type: string;
  name: string;
}): boolean {
  const mime = (file.type || "").toLowerCase();
  if (mime && ALLOWED_MIME.has(mime)) return true;

  const name = file.name.toLowerCase();
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(name);
}

export function projectImageExtension(file: {
  type: string;
  name: string;
}): string {
  const mime = (file.type || "").toLowerCase();
  if (mime && EXT_BY_MIME[mime]) return EXT_BY_MIME[mime];

  const match = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (match && /^(jpe?g|png|webp|gif|heic|heif)$/.test(match[1])) {
    return match[1] === "jpeg" ? "jpg" : match[1];
  }

  return "jpg";
}

export function projectImageContentType(file: {
  type: string;
  name: string;
}): string {
  const mime = (file.type || "").toLowerCase();
  if (mime && ALLOWED_MIME.has(mime)) return mime;

  const ext = projectImageExtension(file);
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  return "application/octet-stream";
}

export function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value || "").trim();
  return text || null;
}
