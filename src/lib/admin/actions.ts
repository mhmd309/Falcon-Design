"use server";

import { assertAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  contactEmailSchema,
  contactSettingsSchema,
  coreValueSchema,
  galleryCategorySchema,
  galleryItemSchema,
  messageStatusSchema,
  sectionUpdateSchema,
  seoFieldsSchema,
  serviceSchema,
  siteSettingsSchema,
  statisticSchema,
  teamMemberSchema,
  timelineItemSchema,
} from "@/lib/validation/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateLocales(paths: string[]) {
  for (const locale of ["en", "ar"] as const) {
    for (const path of paths) {
      revalidatePath(`/${locale}${path}`);
    }
  }
}

function notConfigured(): ActionResult {
  return {
    ok: false,
    error: "Supabase is not configured. Changes cannot be saved.",
  };
}

function handleError(err: unknown): ActionResult {
  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    return { ok: false, error: "Unauthorized" };
  }
  if (err instanceof z.ZodError) {
    return { ok: false, error: err.issues[0]?.message || "Validation failed." };
  }
  return { ok: false, error: "Something went wrong. Please try again." };
}

export async function updateSection(
  input: z.infer<typeof sectionUpdateSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = sectionUpdateSchema.parse(input);
    const { page_slug, section_key, ...fields } = data;

    const supabase = await createClient();
    const { error } = await supabase
      .from("site_sections")
      .upsert(
        { page_slug, section_key, ...fields },
        { onConflict: "page_slug,section_key" },
      );

    if (error) return { ok: false, error: "Failed to update section." };

    revalidateLocales(["", `/${page_slug === "home" ? "" : page_slug}`]);
    if (page_slug === "home") revalidateLocales(["/"]);
    else revalidateLocales([`/${page_slug}`]);

    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updatePageSeo(
  slug: string,
  input: z.infer<typeof seoFieldsSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = seoFieldsSchema.parse(input);
    const supabase = await createClient();
    const { error } = await supabase
      .from("site_pages")
      .update(data)
      .eq("slug", slug);

    if (error) return { ok: false, error: "Failed to update SEO." };

    const path = slug === "home" ? "" : `/${slug}`;
    revalidateLocales([path]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertStatistic(
  input: z.infer<typeof statisticSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = statisticSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("statistics").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update statistic." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("statistics").insert(insert);
      if (error) return { ok: false, error: "Failed to create statistic." };
    }

    revalidateLocales(["", "/"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteStatistic(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("statistics").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete statistic." };

    revalidateLocales(["", "/"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertCoreValue(
  input: z.infer<typeof coreValueSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = coreValueSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("core_values").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update core value." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("core_values").insert(insert);
      if (error) return { ok: false, error: "Failed to create core value." };
    }

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteCoreValue(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("core_values").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete core value." };

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertTimelineItem(
  input: z.infer<typeof timelineItemSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = timelineItemSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("timeline_items").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update timeline item." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("timeline_items").insert(insert);
      if (error) return { ok: false, error: "Failed to create timeline item." };
    }

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteTimelineItem(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("timeline_items").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete timeline item." };

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertTeamMember(
  input: z.infer<typeof teamMemberSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = teamMemberSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("team_members").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update team member." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("team_members").insert(insert);
      if (error) return { ok: false, error: "Failed to create team member." };
    }

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete team member." };

    revalidateLocales(["/about"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertService(
  input: z.infer<typeof serviceSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = serviceSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("services").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update service." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("services").insert(insert);
      if (error) return { ok: false, error: "Failed to create service." };
    }

    revalidateLocales(["", "/", "/services"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete service." };

    revalidateLocales(["", "/", "/services"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertGalleryCategory(
  input: z.infer<typeof galleryCategorySchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = galleryCategorySchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase
        .from("gallery_categories")
        .update(data)
        .eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update category." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("gallery_categories").insert(insert);
      if (error) return { ok: false, error: "Failed to create category." };
    }

    revalidateLocales(["/gallery"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteGalleryCategory(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("gallery_categories").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete category." };

    revalidateLocales(["/gallery"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function upsertGalleryItem(
  input: z.infer<typeof galleryItemSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = galleryItemSchema.parse(input);
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from("gallery_items").update(data).eq("id", data.id);
      if (error) return { ok: false, error: "Failed to update gallery item." };
    } else {
      const { id, ...insert } = data;
      void id;
      const { error } = await supabase.from("gallery_items").insert(insert);
      if (error) return { ok: false, error: "Failed to create gallery item." };
    }

    revalidateLocales(["", "/", "/gallery"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const supabase = await createClient();
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return { ok: false, error: "Failed to delete gallery item." };

    revalidateLocales(["", "/", "/gallery"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateContactSettings(
  input: z.infer<typeof contactSettingsSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = contactSettingsSchema.parse(input);
    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_settings")
      .update(data)
      .eq("id", data.id);

    if (error) return { ok: false, error: "Failed to update contact settings." };

    revalidateLocales(["/contact"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateContactEmails(
  emails: z.infer<typeof contactEmailSchema>[],
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    if (emails.length !== 5) {
      return { ok: false, error: "Exactly 5 contact emails are required." };
    }

    const parsed = z.array(contactEmailSchema).length(5).parse(emails);
    const supabase = await createClient();

    for (const email of parsed) {
      const { error } = await supabase
        .from("contact_emails")
        .update({
          label_ar: email.label_ar,
          label_en: email.label_en,
          email: email.email,
          is_active: email.is_active,
          sort_order: email.sort_order,
        })
        .eq("id", email.id);

      if (error) return { ok: false, error: "Failed to update contact emails." };
    }

    revalidateLocales(["/contact"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateMessageStatus(
  input: z.infer<typeof messageStatusSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = messageStatusSchema.parse(input);
    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) return { ok: false, error: "Failed to update message status." };

    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateSiteSettings(
  input: z.infer<typeof siteSettingsSchema>,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!isSupabaseConfigured()) return notConfigured();

    const data = siteSettingsSchema.parse(input);
    const supabase = await createClient();
    const { error } = await supabase
      .from("site_settings")
      .update(data)
      .eq("id", data.id);

    if (error) return { ok: false, error: "Failed to update site settings." };

    revalidateLocales(["", "/", "/about", "/services", "/gallery", "/contact"]);
    return { ok: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function logoutAction() {
  await assertAdmin();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
