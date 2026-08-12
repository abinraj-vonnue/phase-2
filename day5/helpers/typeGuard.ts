import type { Ticket } from "../controllers/ticketManager";

export function isStatus(status: string): status is Ticket["status"] {
    return ["pending", "completed"].includes(status);
}
export function isPriority(priority: string): priority is Ticket["priority"] {
    return ["high", "medium", "low"].includes(priority);
}

export function isPartialTicket(body: any): body is Partial<Ticket> {
    if (body === null || typeof body !== "object") return false;
    const fields = ["id", "title", "description", "assignee"];

    if (
        fields.some((field) => field in body && typeof body[field] !== "string")
    )
        return false;

    if (body.priority !== undefined && !isPriority(body.priority)) return false;
    if (body.status !== undefined && !isStatus(body.status)) return false;
    if (
        !body.title &&
        !body.status &&
        !body.id &&
        !body.description &&
        !body.priority &&
        !body.assignee
    )
        return false;
    return true;
}

export function isTicket(body: any): body is Ticket {
    return (
        typeof body === "object" &&
        body !== null &&
        typeof body.id === "string" &&
        typeof body.title === "string" &&
        typeof body.description === "string" &&
        typeof body.assignee === "string" &&
        isStatus(body.status) &&
        isPriority(body.priority)
    );
}
