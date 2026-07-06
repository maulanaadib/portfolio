import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { experienceSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("experience", experienceSchema);
export const DELETE = makeDeleteHandler("experience");
