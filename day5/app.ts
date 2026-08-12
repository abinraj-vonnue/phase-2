import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import {
    getTicket,
    readData,
    addTicket,
    type Ticket,
} from "./controllers/ticketManager";

const app: Express = express();
app.use(express.json());

app.get("/tickets", async (req: Request, res: Response) => {
    const data = JSON.parse(await readData());
    res.json({ data: data });
});
app.get("/tickets/:id", async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    const ticket = await getTicket(id);
    if (ticket) {
        res.status(200).json(ticket);
    } else {
        res.status(404).json({ error: "ticket not found" });
    }
});
app.post("/tickets", async (req: Request, res: Response) => {
    const ticket = req.body;
    if (await addTicket(ticket)) {
        res.status(201).json({ message: "successfully created ticket" });
    } else {
        res.status(500).json({ error: "bad request" });
    }
});

export default app;
