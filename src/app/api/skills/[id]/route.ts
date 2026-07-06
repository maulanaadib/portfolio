import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { skillSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("skill", skillSchema);
export const DELETE = makeDeleteHandler("skill");
