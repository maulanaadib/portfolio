"use client";
import { CrudList, type FieldConfig } from "@/components/admin/CrudList";

type Education = { id: string; school: string; degree: string; field: string | null; startDate: string; endDate: string | null; description: string | null; order: number };

const fields: FieldConfig[] = [
  { name: "school", label: "School *", type: "text", required: true },
  { name: "degree", label: "Degree *", type: "text", required: true, placeholder: "Bachelor's, Master's, etc." },
  { name: "field", label: "Field of study", type: "text", placeholder: "Computer Science" },
  { name: "startDate", label: "Start date *", type: "text", required: true, placeholder: "2019-09" },
  { name: "endDate", label: "End date (leave empty for Present)", type: "text", placeholder: "2023-06" },
  { name: "description", label: "Description (optional)", type: "textarea" },
  { name: "order", label: "Sort order", type: "number" },
];

export function EducationEditor({ initial }: { initial: Education[] }) {
  return (
    <CrudList
      title="Education"
      description="Your academic background"
      apiBase="/api/education"
      initial={initial}
      emptyItem={() => ({ school: "", degree: "", field: "", startDate: "", endDate: "", description: "", order: 0 })}
      itemKey={(e) => `${String(e.degree)} @ ${String(e.school)}`}
      fields={fields}
    />
  );
}
