import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { experienceSchema } from "@/lib/schemas";

export const GET = makeListHandler("experience", [{ order: "asc" }, { startDate: "desc" }]);
export const POST = makeCreateHandler("experience", experienceSchema);
