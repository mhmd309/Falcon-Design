import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { storagePathFromPublicUrl } from "@/lib/projects";
import { revalidateProjectPages } from "@/lib/projects-cache";
import {
  getStorageBucket,
  getSupabaseAdmin,
  ensureStorageBucket,
} from "@/lib/supabase/admin";
import type { ProjectRecord } from "@/types/content";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function json(data: object, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function toProjectRecord(project: {
  id: string;
  imageUrl: string;
  ownerName: string;
  consultantName: string;
  projectContractorName: string;
  createdAt: Date;
}): ProjectRecord {
  return {
    id: project.id,
    imageUrl: project.imageUrl,
    ownerName: project.ownerName,
    consultantName: project.consultantName,
    projectContractorName: project.projectContractorName,
    createdAt: project.createdAt.toISOString(),
  };
}

async function uploadImage(image: File) {
  if (!ALLOWED_TYPES.has(image.type)) {
    throw new Error("UNSUPPORTED_TYPE");
  }
  if (image.size > MAX_IMAGE_BYTES) {
    throw new Error("TOO_LARGE");
  }

  const ext =
    image.type === "image/png"
      ? "png"
      : image.type === "image/webp"
        ? "webp"
        : image.type === "image/gif"
          ? "gif"
          : "jpg";

  const path = `projects/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  try {
    const bucket = await ensureStorageBucket();
    const supabase = getSupabaseAdmin();
    const buffer = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("storage upload failed", uploadError);
      throw new Error(uploadError.message || "UPLOAD_FAILED");
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { imageUrl: publicData.publicUrl, path, bucket };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Supabase is not configured";
    if (
      message === "UNSUPPORTED_TYPE" ||
      message === "TOO_LARGE" ||
      message === "UPLOAD_FAILED" ||
      message.startsWith("SUPABASE_CONFIG:")
    ) {
      throw error instanceof Error ? error : new Error(message);
    }
    throw new Error(`SUPABASE_CONFIG:${message}`);
  }
}

async function removeStoredImage(imageUrl: string) {
  try {
    const bucket = getStorageBucket();
    const path = storagePathFromPublicUrl(imageUrl, bucket);
    if (!path) return;
    const supabase = getSupabaseAdmin();
    await supabase.storage.from(bucket).remove([path]);
  } catch (error) {
    console.error("storage delete failed", error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return json({ error: "Unauthorized" }, 401);
  if (!isDatabaseConfigured()) {
    return json({ error: "Database is not configured" }, 503);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return json({ error: "Project not found" }, 404);

    const form = await request.formData();
    const image = form.get("image");
    const ownerName = String(form.get("ownerName") || "").trim();
    const consultantName = String(form.get("consultantName") || "").trim();
    const projectContractorName = String(
      form.get("projectContractorName") || "",
    ).trim();

    if (!ownerName || !consultantName || !projectContractorName) {
      return json({ error: "All fields are required" }, 400);
    }

    let imageUrl = existing.imageUrl;
    if (image instanceof File && image.size > 0) {
      try {
        const uploaded = await uploadImage(image);
        imageUrl = uploaded.imageUrl;
        if (existing.imageUrl !== imageUrl) {
          await removeStoredImage(existing.imageUrl);
        }
      } catch (error) {
        const code = error instanceof Error ? error.message : "";
        if (code === "UNSUPPORTED_TYPE") {
          return json({ error: "Unsupported image type" }, 400);
        }
        if (code === "TOO_LARGE") {
          return json({ error: "Image must be 5MB or smaller" }, 400);
        }
        if (code.startsWith("SUPABASE_CONFIG:")) {
          return json({ error: code.replace("SUPABASE_CONFIG:", "") }, 503);
        }
        return json(
          {
            error:
              code && code !== "UPLOAD_FAILED"
                ? `Failed to upload image: ${code}`
                : "Failed to upload image",
          },
          500,
        );
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        imageUrl,
        ownerName,
        consultantName,
        projectContractorName,
      },
    });

    revalidateProjectPages();
    return json({ project: toProjectRecord(project) });
  } catch (error) {
    console.error("update project failed", error);
    return json({ error: "Failed to update project" }, 500);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return json({ error: "Unauthorized" }, 401);
  if (!isDatabaseConfigured()) {
    return json({ error: "Database is not configured" }, 503);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return json({ error: "Project not found" }, 404);

    await prisma.project.delete({ where: { id } });
    await removeStoredImage(existing.imageUrl);

    revalidateProjectPages();
    return json({ ok: true });
  } catch (error) {
    console.error("delete project failed", error);
    return json({ error: "Failed to delete project" }, 500);
  }
}
