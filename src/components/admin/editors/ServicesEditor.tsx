"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Service = { id: string; title: string; description: string; icon: string | null; order: number };

const fields: FieldConfig[] = [
  { name: "title", label: "Title *", type: "text", required: true },
  { name: "description", label: "Description *", type: "textarea", required: true },
  { name: "icon", label: "Icon (emoji)", type: "text", placeholder: "✨" },
  { name: "order", label: "Sort order", type: "number" },
];

export function ServicesEditor({ initial }: { initial: Service[] }) {
  return (
    <CrudList
      title="Services"
      description="What you offer to clients"
      apiBase="/api/services"
      initial={initial}
      emptyItem={() => ({ title: "", description: "", icon: "✨", order: 0 })}
      itemKey={(s) => String(s.title)}
      fields={fields}
    />
  );
}
