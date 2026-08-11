import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import {
    addTask,
    deleteTask,
    getTask,
    readJson,
    updateTask,
    type Task,
} from "./controllers/taskManager";
import { isTask } from "./helpers/typeGuards";

const app: Express = express();
app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Error");
});

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "up" });
});

//
app.get("/tasks", async (req: Request, res: Response) => {
    const tasks: Task[] = JSON.parse(await readJson());
    res.status(200).json(tasks);
});
app.get("/tasks/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const tasks: Task[] = JSON.parse(await readJson());
    const task = tasks.find((task) => task.id === id);
    if (task) res.status(200).json(task);
    else res.status(404).json({ error: "Task not found" });
});

app.post("/tasks", (req: Request, res: Response) => {
    const task = req.body;
    if (isTask(task)) {
        addTask(task);
        res.status(201).json({
            message: "New task created successfully",
            data: task,
        });
    } else {
        res.status(500).json({
            error: "Failed to Add task",
        });
    }
});
app.patch("/tasks/:id", async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    const updates: Partial<Task> = req.body;
    const task = await getTask(id);
    if (!task) {
        res.status(404).json({ error: "Task not found" });
    }
    if (!updates) {
        res.status(500).json({ error: "Bad Request" });
    } else {
        updateTask(id, req.body);
        res.status(200).json({ message: "Successfully updated Task" });
    }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    const task = await getTask(id);
    if (!task) {
        res.status(404).json({ error: "Task not found" });
    } else {
        deleteTask(id);
        res.status(200).json({ message: "Successfully Deleted task" });
    }
});
export default app;
