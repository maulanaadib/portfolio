import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type Handler<T> = () => Promise<T>;

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function handleZodError(e: ZodError) {
  return NextResponse.json(
    { error: "Validation failed", issues: e.flatten().fieldErrors },
    { status: 400 }
  );
}

export function handleError(e: unknown) {
  console.error(e);
  if (e instanceof Error) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
