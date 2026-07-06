import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { testimonialSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("testimonial", testimonialSchema);
export const DELETE = makeDeleteHandler("testimonial");
