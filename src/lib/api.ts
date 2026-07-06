import { NextResponse } from "next/server";
import { isAdmin } from "./guards";

export async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const };
}
