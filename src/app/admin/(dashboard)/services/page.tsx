import { prisma } from "@/lib/prisma";
import { ServicesEditor } from "@/components/admin/editors/ServicesEditor";

export default async function ServicesPage() {
  const items = await prisma.service.findMany({ orderBy: [{ order: "asc" }] });
  return <ServicesEditor initial={items} />;
}
