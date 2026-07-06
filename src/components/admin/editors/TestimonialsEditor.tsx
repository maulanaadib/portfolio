"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Testimonial = { id: string; name: string; role: string | null; company: string | null; content: string; avatarUrl: string | null; order: number };

const fields: FieldConfig[] = [
  { name: "name", label: "Name *", type: "text", required: true },
  { name: "role", label: "Role", type: "text", placeholder: "CEO" },
  { name: "company", label: "Company", type: "text" },
  { name: "content", label: "Quote *", type: "textarea", required: true },
  { name: "avatarUrl", label: "Avatar URL (optional)", type: "url" },
  { name: "order", label: "Sort order", type: "number" },
];

export function TestimonialsEditor({ initial }: { initial: Testimonial[] }) {
  return (
    <CrudList
      title="Testimonials"
      description="Quotes from clients or colleagues"
      apiBase="/api/testimonials"
      initial={initial}
      emptyItem={() => ({ name: "", role: "", company: "", content: "", avatarUrl: "", order: 0 })}
      itemKey={(t) => String(t.name)}
      fields={fields}
    />
  );
}
