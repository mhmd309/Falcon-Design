import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  paths: z.array(z.string()).min(1).max(20),
});

export async function POST(request: Request) {
  try {
    const { isAdmin } = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid paths." }, { status: 400 });
    }

    for (const path of parsed.data.paths) {
      revalidatePath(path);
      for (const locale of ["en", "ar"] as const) {
        revalidatePath(`/${locale}${path === "/" ? "" : path}`);
      }
    }

    return NextResponse.json({ ok: true, revalidated: parsed.data.paths });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Revalidation failed." },
      { status: 500 },
    );
  }
}
