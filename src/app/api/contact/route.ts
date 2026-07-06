import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_MESSAGES = 3;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit({ key: `contact:${ip}`, max: MAX_MESSAGES, windowMs: WINDOW_MS });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${Math.ceil(limit.resetMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim() || null;
    const content = String(form.get("content") ?? "").trim();

    if (!name || !email || !content) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    if (name.length > 120 || email.length > 200 || (subject?.length ?? 0) > 200 || content.length > 5000) {
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.message.create({ data: { name, email, subject, content } });
    return NextResponse.redirect(new URL("/?contact=sent", req.url), 303);
  } catch (e) {
    console.error("contact form error", e);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
