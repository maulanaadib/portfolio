import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { serviceSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("service", serviceSchema);
export const DELETE = makeDeleteHandler("service");
