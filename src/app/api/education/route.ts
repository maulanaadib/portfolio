import { makeListHandler, makeCreateHandler } from "@/lib/crud";
import { educationSchema } from "@/lib/schemas";

export const GET = makeListHandler("education", [{ order: "asc" }, { startDate: "desc" }]);
export const POST = makeCreateHandler("education", educationSchema);
