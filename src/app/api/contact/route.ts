import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim() || null;
    const content = String(form.get("content") ?? "").trim();

    if (!name || !email || !content) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.message.create({ data: { name, email, subject, content } });
    // Redirect back with success flag
    return NextResponse.redirect(new URL("/?contact=sent", req.url), 303);
  } catch (e) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
