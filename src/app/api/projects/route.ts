import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { projectSchema } from "@/lib/schemas";

export const GET = makeListHandler("project", [{ order: "asc" }, { createdAt: "desc" }]);
export const POST = makeCreateHandler("project", projectSchema);
