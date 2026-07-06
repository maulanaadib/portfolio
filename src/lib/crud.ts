import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { requireAdmin } from "./api";
import { handleError, handleZodError, json } from "./api-helpers";
import type { ZodSchema } from "zod";

type ModelName = "skill" | "project" | "experience" | "education" | "service" | "testimonial" | "message";

const models = {
  skill: prisma.skill,
  project: prisma.project,
  experience: prisma.experience,
  education: prisma.education,
  service: prisma.service,
  testimonial: prisma.testimonial,
  message: prisma.message,
} as const;

export function makeListHandler(name: ModelName, defaultOrder: object = { order: "asc" }) {
  return async function GET() {
    const items = await (models[name] as unknown as { findMany: (a: object) => Promise<unknown[]> }).findMany({
      orderBy: defaultOrder,
    });
    return NextResponse.json(items);
  };
}

export function makeCreateHandler<T>(name: ModelName, schema: ZodSchema<T>) {
  return async function POST(req: Request) {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.res;
    try {
      const body = await req.json();
      const data = schema.parse(body);
      const created = await (models[name] as unknown as { create: (a: object) => Promise<unknown> }).create({ data });
      return json(created, { status: 201 });
    } catch (e) {
      if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "ZodError") {
        return handleZodError(e as never);
      }
      return handleError(e);
    }
  };
}

export function makeUpdateHandler<T>(name: ModelName, schema: ZodSchema<T>) {
  return async function PUT(req: Request, { params }: { params: { id: string } }) {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.res;
    try {
      const body = await req.json();
      const data = schema.parse(body);
      const updated = await (models[name] as unknown as {
        update: (a: object) => Promise<unknown>;
      }).update({ where: { id: params.id }, data });
      return json(updated);
    } catch (e) {
      if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "ZodError") {
        return handleZodError(e as never);
      }
      return handleError(e);
    }
  };
}

export function makeDeleteHandler(name: ModelName) {
  return async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.res;
    try {
      await (models[name] as unknown as { delete: (a: object) => Promise<unknown> }).delete({
        where: { id: params.id },
      });
      return json({ ok: true });
    } catch (e) {
      return handleError(e);
    }
  };
}
