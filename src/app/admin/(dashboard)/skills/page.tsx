import { prisma } from "@/lib/prisma";
import { SkillsEditor } from "@/components/admin/editors/SkillsEditor";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });
  return <SkillsEditor initial={skills} />;
}
