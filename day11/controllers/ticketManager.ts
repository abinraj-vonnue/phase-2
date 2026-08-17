//ticketManager
import { query, close } from "../db.ts";

export type Ticket = {
    ticket_id: number;
    title: string;
    description: string | null;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "high" | "low" | "medium";
    customer_id: number;
    category_id: number;
};
export async function getTickets() {
    const res = await query("SELECT * FROM tickets");
    return res ? res.rows : [];
}

export async function getTicketById(id: number) {
    const res = await query("SELECT * FROM tickets WHERE ticket_id = $1", [id]);
    return res?.rows[0] ?? null;
}
export async function deleteTicket(id: number): Promise<boolean> {
    const res = await query("DELETE FROM tickets WHERE ticket_id = $1", [id]);
    return res?.rowCount === 1;
}

export async function addTicket(ticket: Omit<Ticket, "ticket_id">) {
    const res = await query(
        `INSERT INTO tickets
        (title,description,status,priority,customer_id,category_id) 
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *;`,
        [
            ticket.title,
            ticket.description,
            ticket.status,
            ticket.priority,
            ticket.customer_id,
            ticket.category_id,
        ]
    );
    return res?.rows[0] ?? null;
}
export async function updateTicket(
    id: number,
    updates: Partial<Omit<Ticket, "ticket_id">>
) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return null;
    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const values = keys.map((key) => updates[key as keyof typeof updates]);
    const res = await query(
        `UPDATE tickets
        SET ${setClause}
        WHERE ticket_id = $${keys.length + 1}
        RETURNING *;`,
        [...values, id]
    );
    return res?.rows[0] ?? null;
}

export async function assignTicket(id: number, assignee_id: number) {
    const res = await query(
        `
        INSERT into  assignments(ticket_id,assignee_id)
        VALUES ($1,$2)
        ON CONFLICT (ticket_id)
        DO UPDATE SET assignee_id = EXCLUDED.assignee_id
        RETURNING *;`,
        [id, assignee_id]
    );
    return res?.rows[0] ?? null;
}
