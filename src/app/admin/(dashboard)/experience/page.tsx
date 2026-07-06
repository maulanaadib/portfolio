import { prisma } from "@/lib/prisma";
import { ExperienceEditor } from "@/components/admin/editors/ExperienceEditor";

export default async function ExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
  return <ExperienceEditor initial={items} />;
}
