import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { revalidateProjectPages } from "@/lib/projects-cache";
import { getSupabaseAdmin, ensureStorageBucket } from "@/lib/supabase/admin";
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

export async function GET() {
  if (!isDatabaseConfigured()) {
    return json({ projects: [] as ProjectRecord[] });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return json({ projects: projects.map(toProjectRecord) });
  } catch (error) {
    console.error("list projects failed", error);
    return json(
      { projects: [] as ProjectRecord[], error: "Failed to load projects" },
      500,
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (!isDatabaseConfigured()) {
    return json({ error: "Database is not configured" }, 503);
  }

  try {
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

    if (!(image instanceof File) || image.size === 0) {
      return json({ error: "Image is required" }, 400);
    }

    if (!ALLOWED_TYPES.has(image.type)) {
      return json({ error: "Unsupported image type" }, 400);
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return json({ error: "Image must be 5MB or smaller" }, 400);
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
    let supabase;
    let bucket: string;
    try {
      supabase = getSupabaseAdmin();
      bucket = await ensureStorageBucket();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Supabase is not configured";
      console.error("supabase storage setup failed", message);
      return json({ error: message }, 503);
    }
    const buffer = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("storage upload failed", uploadError);
      return json(
        {
          error: `Failed to upload image: ${uploadError.message}`,
        },
        500,
      );
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    const imageUrl = publicData.publicUrl;

    const project = await prisma.project.create({
      data: {
        imageUrl,
        ownerName,
        consultantName,
        projectContractorName,
      },
    });

    revalidateProjectPages();
    return json({ project: toProjectRecord(project) }, 201);
  } catch (error) {
    console.error("create project failed", error);
    return json({ error: "Failed to create project" }, 500);
  }
}
