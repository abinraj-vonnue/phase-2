import express, { type Express, type Request, type Response } from "express";
import {
    addTicket,
    assignTicket,
    deleteTicket,
    getTicketById,
    updateTicket,
} from "./controllers/ticketManager";
import {
    ticketsCreateInput,
    ticketsUpdateInput,
} from "./generated/prisma/models";
import { getTickets } from "./controllers/getTickets";

const app: Express = express();
app.use(express.json());
app.set("json spaces", 2);
app.get("/tickets", getTickets);

app.get("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    try {
        const ticket = await getTicketById(id);
        if (ticket) {
            return res.status(200).json(ticket);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Internal Server error" });
    }
});
app.post("/tickets", async (req: Request, res: Response) => {
    try {
        const ticket = req.body as ticketsCreateInput;
        const createdTicket = await addTicket(ticket);
        if (createdTicket) {
            return res.status(201).json(createdTicket);
        }
        return res.status(500).json({ error: "Failed to create ticket" });
    } catch {
        return res.status(500).json({ error: "Failed to create ticket" });
    }
});
app.delete("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    try {
        if (await deleteTicket(id)) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Internal Server error" });
    }
});
app.patch("/tickets/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const updates = req.body as ticketsUpdateInput;
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields provided" });
    }
    try {
        const patchedTicket = await updateTicket(id, updates);
        console.log("patchedTicket", patchedTicket);
        if (patchedTicket) {
            return res.status(200).json(patchedTicket);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Failed to update ticket" });
    }
});
app.patch("/tickets/:id/status", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const { status } = req.body;
    try {
        const patchedTicket = await updateTicket(id, { status });
        if (patchedTicket) {
            return res.status(200).json(patchedTicket);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Failed to update status" });
    }
});
app.patch("/tickets/:id/priority", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const { priority } = req.body;
    try {
        const patchedTicket = await updateTicket(id, { priority });
        if (patchedTicket) {
            return res.status(200).json(patchedTicket);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Failed to update priority" });
    }
});
app.post("/tickets/:id/assign", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const assignee_id = Number(req.body.assignee_id);
    if (Number.isNaN(id) || Number.isNaN(assignee_id)) {
        return res.status(400).json({ error: "Invalid ticket or assignee ID" });
    }
    try {
        const assigned = await assignTicket(id, assignee_id);
        if (assigned) {
            return res.status(200).json(assigned);
        }
        return res.status(404).json({ error: "Ticket not found" });
    } catch {
        return res.status(500).json({ error: "Failed to assign ticket" });
    }
});

export default app;
