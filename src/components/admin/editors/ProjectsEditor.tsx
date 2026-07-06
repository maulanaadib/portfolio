"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Project = { id: string; title: string; slug: string; description: string; content: string | null; imageUrl: string | null; demoUrl: string | null; repoUrl: string | null; tags: string; featured: boolean; order: number };

const fields: FieldConfig[] = [
  { name: "title", label: "Title *", type: "text", required: true },
  { name: "slug", label: "Slug * (auto from title if empty)", type: "text", required: true, placeholder: "my-project" },
  { name: "description", label: "Short description *", type: "textarea", required: true, placeholder: "1-3 sentences" },
  { name: "content", label: "Long description (optional)", type: "textarea" },
  { name: "imageUrl", label: "Cover image URL", type: "url", placeholder: "https://..." },
  { name: "demoUrl", label: "Demo URL", type: "url", placeholder: "https://..." },
  { name: "repoUrl", label: "Source code URL", type: "url", placeholder: "https://github.com/..." },
  { name: "tags", label: "Tags (comma-separated)", type: "text", placeholder: "React, TypeScript, Tailwind" },
  { name: "order", label: "Sort order", type: "number", placeholder: "0" },
  { name: "featured", label: "Featured (highlighted on homepage)", type: "checkbox" },
];

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function ProjectsEditor({ initial }: { initial: Project[] }) {
  return (
    <CrudList
      title="Projects"
      description="Showcase your best work. Mark as Featured to highlight it."
      apiBase="/api/projects"
      initial={initial}
      emptyItem={() => ({
        title: "", slug: "", description: "", content: "",
        imageUrl: "", demoUrl: "", repoUrl: "",
        tags: "", featured: false, order: 0,
      })}
      itemKey={(p) => String(p.title)}
      transform={(p) => ({
        ...p,
        slug: typeof p.slug === "string" && p.slug.length > 0 ? p.slug : slugify(String(p.title ?? "")),
      })}
      fields={fields}
    />
  );
}
