import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { testimonialSchema } from "@/lib/schemas";

export const GET = makeListHandler("testimonial", [{ order: "asc" }]);
export const POST = makeCreateHandler("testimonial", testimonialSchema);
