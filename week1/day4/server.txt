import http from "node:http";

import {
    addTask,
    deleteTask,
    readJson,
    type Task,
    updateTask,
} from "./taskManager.js";
import { createHelpers } from "./helpers/responseHelpers.js";
import { isPartialTask, isTask } from "./helpers/taskTypes.js";

export const server = http.createServer(async (request, response) => {
    createHelpers(response);
    const rawData = await readJson();
    const tasks: Task[] = JSON.parse(rawData);

    request.on("error", (err) => {
        response.error(err, 404);
    });
    response.on("error", (err) => {
        response.error(err);
    });

    let match;

    // GET Tasks
    if (request.method === "GET" && request.url === "/tasks") {
        response.json(tasks, 200);
    }
    // GET Task with id
    else if (
        request.method === "GET" &&
        (match = request.url?.match(/^\/tasks\/(\d+)$/))
    ) {
        const id = match![1];
        const task = tasks.find((task) => task.id === id);
        if (task) {
            response.json(task, 200);
        } else {
            response.error("task not found", 404);
        }
    }
    //  POST Task
    else if (request.method === "POST" && request.url === "/tasks") {
        const body: Uint8Array[] = [];
        request.on("data", (chunk) => {
            body.push(chunk);
        });
        request.on("end", () => {
            const bodystring = Buffer.concat(body).toString();
            const parsedBody: Task = JSON.parse(bodystring);

            if (isTask(parsedBody)) {
                addTask(parsedBody);
                response.json(
                    {
                        message: "task Added successfully\n",
                        data: parsedBody,
                    },
                    200
                );
            } else {
                response.error("Bad request", 400);
            }
        });
    }
    // DELETE Task
    else if (
        request.method === "DELETE" &&
        (match = request.url?.match(/^\/tasks\/(\d+)$/))
    ) {
        const id = match![1];
        const task = tasks.find((task) => task.id === id);
        if (task) {
            deleteTask(id);
            response.json(
                {
                    message: "Task Successfully Deleted",
                    task: task,
                },
                200
            );
        } else response.error("task not found", 404);
    }
    // PATCH Task
    else if (
        request.method === "PATCH" &&
        (match = request.url?.match(/^\/tasks\/(\d+)$/))
    ) {
        const id = match[1];
        const task = tasks.find((task) => task.id === id);
        const body: Uint8Array[] = [];
        request.on("data", (chunk) => body.push(chunk));
        request.on("end", () => {
            const bodyString = Buffer.concat(body).toString();
            const parsedBody = JSON.parse(bodyString);
            if (isPartialTask(parsedBody) && task) {
                updateTask(id, parsedBody);
                response.json({ message: "Successfully updated task" }, 200);
            } else {
                response.error("Bad request", 404);
            }
        });
    } else {
        response.error("Server responded with an error", 404);
    }
});
