import { makeUpdateHandler, makeDeleteHandler } from "@/lib/crud";
import { educationSchema } from "@/lib/schemas";

export const PUT = makeUpdateHandler("education", educationSchema);
export const DELETE = makeDeleteHandler("education");
