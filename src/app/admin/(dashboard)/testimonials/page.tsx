import { prisma } from "@/lib/prisma";
import { TestimonialsEditor } from "@/components/admin/editors/TestimonialsEditor";

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: [{ order: "asc" }] });
  return <TestimonialsEditor initial={items} />;
}
