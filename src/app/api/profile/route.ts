import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";
import { profileSchema } from "@/lib/schemas";
import { handleError, handleZodError, json } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return json(profile);
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;
  try {
    const body = await req.json();
    const data = profileSchema.parse(body);
    const existing = await prisma.profile.findFirst();
    const payload = {
      fullName: data.fullName,
      title: data.title,
      tagline: data.tagline || null,
      bio: data.bio,
      avatarUrl: data.avatarUrl || null,
      location: data.location || null,
      email: data.email || null,
      phone: data.phone || null,
      resumeUrl: data.resumeUrl || null,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
    };
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data: payload })
      : await prisma.profile.create({ data: payload });
    return json(profile);
  } catch (e) {
    if (e instanceof Error && e.name === "ZodError") return handleZodError(e as never);
    return handleError(e);
  }
}
