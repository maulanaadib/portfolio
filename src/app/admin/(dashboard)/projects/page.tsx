import { prisma } from "@/lib/prisma";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return <ProjectsEditor initial={projects} />;
}
