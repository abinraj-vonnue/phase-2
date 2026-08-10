import {
    describe,
    expect,
    jest,
    test,
    beforeEach,
    afterEach,
} from "@jest/globals";
import fs from "node:fs/promises";
import {
    addTask,
    fileExists,
    filterTasks,
    listTasks,
    readJson,
    Task,
} from "./taskManager.js";

const tasks: Task[] = [
    { id: "1", title: "title", status: "pending" },
    { id: "2", title: "title2", status: "completed" },
];

describe("service functions", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Resets history counters
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Safely removes spyOn hooks on console and fs
    });
    test("addTask", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(tasks));
        await addTask(tasks[0]);
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledWith("[+] successfully added task");
    });

    test("readJSON : successfully read file ", async () => {
        const readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(tasks));

        expect(await readJson()).toBe(JSON.stringify(tasks));
        expect(readSpy).toHaveBeenCalled();
    });

    test("listTask : successfully list task", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(tasks));

        await listTasks();
        expect(readSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledWith(tasks);
    });
    test("filter task : successfully filter tasks", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(tasks));
        await filterTasks();

        expect(logSpy).toHaveBeenCalledWith(
            "--------------------todo-------------------\n",
            expect.arrayContaining([
                expect.objectContaining({ status: "pending" }),
            ])
        );
        expect(logSpy.mock.calls[2]).toEqual([
            "--------------------Done-------------------\n",
            expect.arrayContaining([
                expect.objectContaining({ status: "completed" }),
            ]),
        ]);
    });
    test("fileExists : successfully create File", async () => {
        const writeSpy = jest.spyOn(fs, "writeFile").mockResolvedValue();
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const accessspy = jest
            .spyOn(fs, "access")
            .mockRejectedValue(new Error("File not found"));

        await fileExists("notfound");
        expect(logSpy).toHaveBeenCalledWith("creating file", "notfound");
        expect(writeSpy).toHaveBeenCalledWith("notfound", JSON.stringify([]));
    });
});
