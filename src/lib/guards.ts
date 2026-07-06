import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "admin";
}
