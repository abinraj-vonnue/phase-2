import { describe, expect, test } from "@jest/globals";
import app from "../app";
import * as getTickets from "../controllers/getTickets";
import request from "supertest";
import prisma from "../prisma/prisma";

describe(" successfull read", () => {
    test("get all tickets", async () => {
        const raw_res = await request(app)
            .get("/tickets")
            .query({ page: 1, sortDirection: "asc" });
        const res = JSON.parse(raw_res.text);
        const data = res.data;
        const meta = res.meta;
        expect(data).toContainEqual({
            ticket_id: 1,
            title: "Payment failed",
            description: "Payment not processed.",
            status: "open",
            priority: "high",
            customer_id: 1,
            category_id: 1,
            created_at: "2026-08-14T10:23:19.778Z",
        });
        expect(meta).toHaveProperty("page", 1);
    });
    test("get ticket with id", async () => {
        const res = await request(app).get("/tickets/1");
        const data = JSON.parse(res.text);
        expect(data).toEqual({
            ticket_id: 1,
            title: "Payment failed",
            description: "Payment not processed.",
            status: "open",
            priority: "high",
            customer_id: 1,
            category_id: 1,
            created_at: "2026-08-14T10:23:19.778Z",
        });
    });
});
describe(" successfull create and update", () => {
    test("create new ticket", async () => {
        const createSpy = jest.spyOn(prisma.tickets, "create");
        const res = await request(app).post("/tickets").send({
            title: "test ticket",
            description: "test ticket",
            status: "open",
            priority: "high",
            customer_id: 1,
            category_id: 1,
        });
        expect(createSpy).toHaveBeenCalled();
        expect(res.body).toMatchObject({
            title: "test ticket",
            description: "test ticket",
            status: "open",
            priority: "high",
            customer_id: 1,
            category_id: 1,
        });
        expect(res.status).toBe(201);
    });
    test("update status", async () => {
        let res = await request(app).patch("/tickets/2/status").send({
            status: "open",
        });
        expect(res.body).toMatchObject({
            status: "open",
        });
        res = await request(app).patch("/tickets/2/status").send({
            status: "closed",
        });
        expect(res.body).toMatchObject({
            status: "closed",
        });
        expect(res.status).toBe(200);
    });
    test("update priority", async () => {
        let res = await request(app).patch("/tickets/2/priority").send({
            priority: "high",
        });
        expect(res.body).toMatchObject({
            priority: "high",
        });
        res = await request(app).patch("/tickets/2/priority").send({
            priority: "low",
        });
        expect(res.body).toMatchObject({
            priority: "low",
        });
        expect(res.status).toBe(200);
    });
});

describe("endpoints handles errors", () => {
    test("GET : handle invalid id", async () => {
        const res = await request(app).get("/tickets/20000");
        expect(res.body).toEqual({ error: "Ticket not found" });
        expect(res.status).toBe(404);
    });
    test("DELETE : handle invalid id ", async () => {
        const res = await request(app).delete("/tickets/29999");
        expect(res.body).toEqual({ error: "Ticket not found" });
        expect(res.status).toBe(404);
    });
    test("PATCH : handle invalid update inputs ", async () => {
        const res = await request(app).patch("/tickets/29999").send({});

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "No fields provided" });
    });
    test("PATCH : handle  bad request ", async () => {
        const res = await request(app).patch("/tickets/29999");

        expect(res.status).toBe(500);
    });
    test("POST : handle invalid ticket format", async () => {
        const res = await request(app).post("/tickets").send({
            t: "test",
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Failed to create ticket" });
    });
});

describe("Get : pagination", () => {
    test(" read invalid page", async () => {
        const res = await request(app).get("/tickets?page=1000");
        expect(res.body.data).toEqual([]);
        expect(res.body.meta).toMatchObject({
            page: 1000,
        });
    });
    test(" search content", async () => {
        const res = await request(app).get("/tickets?search=Payment failed");
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Payment failed",
                }),
            ])
        );
    });
    test(" navigate to correct page ", async () => {
        const res = await request(app).get("/tickets?page=2");
        expect(res.body.meta).toMatchObject({
            page: 2,
        });
    });
});
