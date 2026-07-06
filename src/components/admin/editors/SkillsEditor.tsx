"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Skill = { id: string; name: string; category: string; level: number; iconUrl: string | null; order: number };

const fields: FieldConfig[] = [
  { name: "name", label: "Name *", type: "text", required: true },
  { name: "category", label: "Category *", type: "text", required: true, placeholder: "e.g. Frontend, Backend, Tools" },
  { name: "level", label: "Level (0-100)", type: "number", placeholder: "50" },
  { name: "iconUrl", label: "Icon URL (optional)", type: "url", placeholder: "https://..." },
  { name: "order", label: "Sort order", type: "number", placeholder: "0" },
];

export function SkillsEditor({ initial }: { initial: Skill[] }) {
  return (
    <CrudList
      title="Skills"
      description="Technical and soft skills you want to showcase"
      apiBase="/api/skills"
      initial={initial}
      emptyItem={() => ({ name: "", category: "Frontend", level: 50, iconUrl: "", order: 0 })}
      itemKey={(s) => `${s.name} (${s.category})`}
      fields={fields}
    />
  );
}
