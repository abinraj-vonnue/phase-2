import { type Task } from "../controllers/taskManager";

export function isTask(body: any): body is Task {
    return (
        body !== null &&
        typeof body === "object" &&
        typeof body.id === "string" &&
        typeof body.title === "string" &&
        (body.status === "completed" || body.status === "pending")
    );
}
export function isPartialTask(body: any): body is Partial<Task> {
    if (body === null || typeof body !== "object") return false;
    const allowdKeys: (keyof Task)[] = ["id", "title", "status"];
    const hasExtraKeys = Object.keys(body).some(
        (key) => !allowdKeys.includes(key as any)
    );
    if (hasExtraKeys) return false;

    if (body.id && typeof body.id !== "string") return false;

    if (body.title && typeof body.title !== "string") return false;
    if (body.status && !["completed", "pending"].includes(body.status))
        return false;
    if (!body.title && !body.status && !body.id) return false;
    return true;
}
