import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";
import { json, handleError } from "@/lib/api-helpers";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;
  try {
    const messages = await prisma.message.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
    return json(messages);
  } catch (e) {
    return handleError(e);
  }
}
