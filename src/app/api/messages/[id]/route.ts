import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";
import { json, handleError, handleZodError } from "@/lib/api-helpers";

const updateSchema = z.object({ read: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;
  try {
    const body = await req.json();
    const { read } = updateSchema.parse(body);
    const updated = await prisma.message.update({ where: { id: params.id }, data: { read } });
    return json(updated);
  } catch (e) {
    if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "ZodError") {
      return handleZodError(e as never);
    }
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;
  try {
    await prisma.message.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
