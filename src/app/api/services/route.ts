import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { serviceSchema } from "@/lib/schemas";

export const GET = makeListHandler("service", [{ order: "asc" }]);
export const POST = makeCreateHandler("service", serviceSchema);
