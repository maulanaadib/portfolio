import { prisma } from "@/lib/prisma";
import { EducationEditor } from "@/components/admin/editors/EducationEditor";

export default async function EducationPage() {
  const items = await prisma.education.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
  return <EducationEditor initial={items} />;
}
