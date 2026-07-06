import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { skillSchema } from "@/lib/schemas";

export const GET = makeListHandler("skill", [{ category: "asc" }, { order: "asc" }]);
export const POST = makeCreateHandler("skill", skillSchema);
