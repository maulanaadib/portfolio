import { prisma } from "@/lib/prisma";
import { MessagesList } from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
  return <MessagesList initial={messages} />;
}
