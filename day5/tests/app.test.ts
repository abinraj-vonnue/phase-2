import app from "../app";
import supertest from "supertest";
import fs from "node:fs/promises";

const mockTickets = [
    {
        id: "1",
        title: "ticket1",
        description: "ticket1 ....",
        assignee: "Rohan",
        priority: "high",
        status: "pending",
    },
    {
        id: "2",
        title: "ticket 2",
        description: "ticket2 ....",
        assignee: "Rohith",
        priority: "high",
        status: "completed",
    },
];

let readSpy: ReturnType<typeof jest.spyOn>;
let writeSpy: ReturnType<typeof jest.spyOn>;

describe("server", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        readSpy = jest
            .spyOn(fs, "readFile")
            .mockResolvedValue(JSON.stringify(mockTickets));
        writeSpy = jest.spyOn(fs, "writeFile").mockResolvedValue();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    test("successfully fetch  all tickets ", async () => {
        const response = await supertest(app).get("/tickets");
        console.log(response.body);
        expect(response.body.data).toContainEqual({
            id: "1",
            title: "ticket1",
            description: "ticket1 ....",
            assignee: "Rohan",
            priority: "high",
            status: "pending",
        });
    });
    test("successfully get task with id", async () => {
        const response = await supertest(app).get("/tickets/1");
        expect(response.body).toEqual({
            id: "1",
            title: "ticket1",
            description: "ticket1 ....",
            assignee: "Rohan",
            priority: "high",
            status: "pending",
        });
    });
    test("successfully patch ticket status", async () => {
        const response = await supertest(app)
            .patch("/tickets/2/status")
            .send({ status: "pending" });
        expect(response.body).toEqual({
            message: "successfully updated status",
        });

        expect(writeSpy.mock.calls[0][1]).toContain(
            JSON.stringify({
                id: "2",
                title: "ticket 2",
                description: "ticket2 ....",
                assignee: "Rohith",
                priority: "high",
                status: "pending",
            })
        );
    });
    test("successfully assign ticket ", async () => {
        const response = await supertest(app)
            .patch("/tickets/2/assign")
            .send({ assignee: "Tony Stark" });
        expect(response.body).toEqual({
            message: "successfully assigned ticket",
        });
        const data = JSON.parse(writeSpy.mock.calls[0][1]);
        expect(data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: "2",
                    assignee: "Tony Stark",
                }),
            ])
        );
    });
    test("successfully delete ticket", async () => {
        const response = await supertest(app).delete("/tickets/2");
        const expected = { message: "successfully deleted ticket" };
        const newTicket = mockTickets.filter((ticket) => ticket.id !== "2");
        expect(response.body).toMatchObject(expected);
        expect(JSON.parse(writeSpy.mock.calls[0][1])).toEqual(newTicket);
    });
    test("successfully post new ticket", async () => {
        const response = await supertest(app).post("/tickets").send({
            id: "3",
            title: "ticket 3",
            description: "ticket3 ....",
            assignee: "Rohith",
            priority: "high",
            status: "completed",
        });
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(writeSpy.mock.calls[0][1])).toMatchObject(
            expect.arrayContaining([
                {
                    id: "3",
                    title: "ticket 3",
                    description: "ticket3 ....",
                    assignee: "Rohith",
                    priority: "high",
                    status: "completed",
                },
            ])
        );
    });
});
