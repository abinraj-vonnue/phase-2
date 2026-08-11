import fs from "node:fs/promises";
import * as readLine from "node:readline/promises";
import { argv0, exit, stdin as input, stdout as output } from "node:process";

const storage_path = process.cwd() + "/tasks.json";
export type Task = {
    id: string;
    title: string;
    status: "completed" | "pending";
};

export async function fileExists(path: string) {
    const a: object[] = [];
    try {
        await fs.access(path, fs.constants.F_OK);
    } catch {
        console.log("creating file", path);
        await fs.writeFile(path, JSON.stringify(a));
    }
}
export async function readJson() {
    const rawData = await fs.readFile(storage_path, "utf-8");
    return rawData;
}

let task: Task;
task = {
    id: "1",
    title: "task1",
    status: "pending",
};
export async function deleteTask(id: Task["id"]) {
    const rawData = await readJson();
    if (rawData) {
        const jsonArray = JSON.parse(String(rawData));
        const newArray = jsonArray.filter((task: Task) => task.id !== id);
        const updatedData = JSON.stringify(newArray);
        await fs.writeFile(storage_path, updatedData);
    }
}

export async function addTask(task: Task) {
    const rawData = await readJson();
    if (rawData) {
        const jsonArray = JSON.parse(String(rawData));
        jsonArray.push(task);
        const updatedData = JSON.stringify(jsonArray);
        await fs.writeFile(storage_path, updatedData);
    }
}

export async function listTasks() {
    const rawData = await readJson();
    if (rawData) {
        const jsonArray = JSON.parse(String(rawData));
        console.log(jsonArray);
    } else {
        console.log("No tasks added");
    }
}
export async function filterTasks() {
    const rawData = await readJson();
    if (rawData) {
        const jsonArray = JSON.parse(String(rawData));
        const todo: Task[] = jsonArray.filter(
            (task: Task) => task.status === "pending"
        );
        const done: Task[] = jsonArray.filter(
            (task: Task) => task.status === "completed"
        );

        console.log(
            "--------------------todo-------------------\n",
            todo[0] ? todo : "\n\tEmpty\n"
        );
        console.log("---------------------------------------------");
        console.log(
            "--------------------Done-------------------\n",
            done[0] ? done : "\n\t\t   Empty\n"
        );
        console.log("---------------------------------------------");
    }
}
export async function readInput(rl: readLine.Interface): Promise<Task> {
    let task: Task;
    const title = await rl.question("task_title : ");
    let statusChoie = await rl.question(
        "status : \t [1 : pending \t2 : completed]"
    );
    const status: "completed" | "pending" =
        statusChoie === "2" ? "completed" : "pending";
    task = {
        id: crypto.randomUUID(),
        title: title,
        status: status,
    };
    return task;
}
export async function init() {
    console.log("\t\tTASK MANAGER\n");
    await fileExists(storage_path);
    const rl = readLine.createInterface({ input, output });
    console.log(
        "1 : add task\n2 : list all task\n3 : filter tasks\nexit : exit"
    );
    while (1) {
        const input = await rl.question("\n\nEnter choice: ");
        switch (input) {
            case "1":
                const task = await readInput(rl);
                await addTask(task);
                break;
            case "2":
                await listTasks();
                break;
            case "3":
                await filterTasks();
                break;
            case "exit":
                console.log("[x] exiting");
                exit();
            default:
                console.log("invalid choice");
        }
    }
}

// if (process.env.NODE_ENV != "test") {
//     init();
// }

export async function updateTask(id: string, updates: Partial<Task>) {
    const rawData = await readJson();
    const tasks: Task[] = JSON.parse(rawData);
    const updatedTask = tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
    );
    await fs.writeFile(storage_path, JSON.stringify(updatedTask));
    return updatedTask;
}

export async function getTask(id: string) {
    const rawData = await readJson();
    const tasks: Task[] = JSON.parse(rawData);
    const task = tasks.find((task) => task.id === id);
    return task;
}
