import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { projectSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("project", projectSchema);
export const DELETE = makeDeleteHandler("project");
