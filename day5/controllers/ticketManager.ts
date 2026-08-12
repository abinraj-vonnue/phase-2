import fs from "node:fs/promises";
import { isPartialTicket, isTicket } from "../helpers/typeGuard";
const path = process.cwd() + "/data/tickets.json";

export type Ticket = {
    id: string;
    title: string;
    description: string;
    assignee: string;
    priority: "high" | "low" | "medium";
    status: "pending" | "completed";
};
export async function readData() {
    const rawData = await fs.readFile(path, "utf-8");
    return rawData;
}
export async function addTicket(ticket: Omit<Ticket, "id">): Promise<boolean> {
    const rawData = await readData();
    const tickets: Ticket[] = rawData ? JSON.parse(rawData) : [];
    const nextId =
        tickets.length === 0
            ? 1
            : Math.max(...tickets.map((ticket) => Number(ticket.id))) + 1;
    const newTicket: Ticket = {
        id: String(nextId),
        ...ticket,
    };
    if (!isTicket(newTicket)) return false;
    tickets.push(newTicket);
    await fs.writeFile(path, JSON.stringify(tickets));
    return true;
}
export async function getTicket(id: string) {
    const data: Ticket[] = JSON.parse(await readData());
    const ticket = data.find((t) => t.id === id);
    return ticket;
}
