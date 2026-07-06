"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Experience = { id: string; company: string; position: string; location: string | null; startDate: string; endDate: string | null; description: string; order: number };

const fields: FieldConfig[] = [
  { name: "company", label: "Company *", type: "text", required: true },
  { name: "position", label: "Position *", type: "text", required: true },
  { name: "location", label: "Location", type: "text", placeholder: "Jakarta, Indonesia / Remote" },
  { name: "startDate", label: "Start date *", type: "text", required: true, placeholder: "2023-01" },
  { name: "endDate", label: "End date (leave empty for Present)", type: "text", placeholder: "2024-12" },
  { name: "description", label: "Description", type: "textarea", placeholder: "What you did / achieved" },
  { name: "order", label: "Sort order", type: "number" },
];

export function ExperienceEditor({ initial }: { initial: Experience[] }) {
  return (
    <CrudList
      title="Experience"
      description="Your work history"
      apiBase="/api/experience"
      initial={initial}
      emptyItem={() => ({ company: "", position: "", location: "", startDate: "", endDate: "", description: "", order: 0 })}
      itemKey={(e) => `${String(e.position)} @ ${String(e.company)}`}
      fields={fields}
    />
  );
}
