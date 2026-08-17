import express, { type Express, type Request, type Response } from "express";
import {
    addTicket,
    assignTicket,
    deleteTicket,
    getTicketById,
    getTickets,
    updateTicket,
    type Ticket,
} from "./controllers/ticketManager.ts";

const app: Express = express();

app.use(express.json());

app.get("/tickets", async (req: Request, res: Response) => {
    const tickets = await getTickets();
    return res.status(200).json(tickets);
});
app.get("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const ticket = await getTicketById(id);
    if (ticket) {
        return res.status(200).json(ticket);
    }
    return res.status(404).json({ error: "ticket not found" });
});
app.post("/tickets", async (req: Request, res: Response) => {
    const ticket = req.body as Omit<Ticket, "ticket_id">;
    const createdTicket = await addTicket(ticket);
    if (createdTicket) {
        return res.status(201).json(createdTicket);
    }
    return res.status(500).json({ error: "Failed to create ticket" });
});
app.delete("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    if (await deleteTicket(Number(id))) {
        return res.sendStatus(204);
    }
    return res.status(404).json({ error: "ticket not found" });
});
app.patch("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const updates = req.body as Partial<Omit<Ticket, "ticket_id">>;
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fileds provided" });
    }
    const patchedTicket = await updateTicket(id, updates);
    if (patchedTicket) {
        return res.status(200).json(patchedTicket);
    }
    return res.status(404).json({ error: "Ticket not found" });
});
app.patch("/tickets/:id/status", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const { status } = req.body;
    const patchedTicket = await updateTicket(id, { status });
    if (patchedTicket) {
        return res.status(200).json(patchedTicket);
    }
    return res.status(404).json({ error: "Ticket not found" });
});
app.patch("/tickets/:id/priority", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const { priority } = req.body;
    const patchedTicket = await updateTicket(id, { priority });
    if (patchedTicket) {
        return res.status(200).json(patchedTicket);
    }
    return res.status(404).json({ error: "Ticket not found" });
});
app.post("/tickets/:id/assign", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { assignee_id } = req.body;
    if (Number.isNaN(id) || !assignee_id) {
        return res.status(400).json({ error: "Invalid ticket or assignee ID" });
    }
    const assigned = await assignTicket(id, assignee_id);
    if (assigned) {
        return res.status(200).json(assigned);
    }
    return res.status(500).json({ error: "failed to assign ticket" });
});

export default app;
