import app from "../app";
import supertest from "supertest";
import fs from "node:fs/promises";

const mockTasks = [
    { id: "1", title: "updated task 1", status: "pending" },
    { id: "45", title: "title", status: "pending" },
    { id: "03", title: "test title", status: "pending" },
    { id: "44", title: "test title 3", status: "pending" },
];

let readSpy: ReturnType<typeof jest.spyOn>;
let writeSpy: ReturnType<typeof jest.spyOn>;
describe("server", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(mockTasks));
        writeSpy = jest.spyOn(fs, "writeFile").mockResolvedValue();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    test("successfully fetch  all tasks ", async () => {
        const response = await supertest(app).get("/tasks");
        expect(response.body).toContainEqual({
            id: "1",
            title: "updated task 1",
            status: "pending",
        });
    });
    test("successfully get task with id", async () => {
        const response = await supertest(app).get("/tasks/1");
        expect(response.body).toEqual({
            id: "1",
            title: "updated task 1",
            status: "pending",
        });
    });
    test("successfully patch task", async () => {
        const response = await supertest(app)
            .patch("/tasks/03")
            .send({ title: "test title 7" });
        expect(response.body).toEqual({
            message: "Successfully updated Task",
        });

        expect(writeSpy.mock.calls[0][1]).toContain(
            JSON.stringify({
                id: "03",
                title: "test title 7",
                status: "pending",
            })
        );
    });
    test("successfully delete task", async () => {
        const response = await supertest(app).delete("/tasks/44");
        const expected = { message: "Successfully Deleted task" };
        const newTasks = mockTasks.filter((task) => task.id !== "44");
        expect(response.body).toMatchObject(expected);
        expect(JSON.parse(writeSpy.mock.calls[0][1])).toEqual(newTasks);
    });
    test("successfully post new task", async () => {
        const response = await supertest(app)
            .post("/tasks")
            .send({ id: "400", title: "testing POST", status: "pending" });
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(writeSpy.mock.calls[0][1])).toMatchObject(
            expect.arrayContaining([
                {
                    id: "400",
                    title: "testing POST",
                    status: "pending",
                },
            ])
        );
    });
});
