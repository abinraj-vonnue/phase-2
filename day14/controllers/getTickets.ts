import { Request, Response } from "express";

import prisma from "../prisma/prisma";

export async function getTickets(req: Request, res: Response) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    let pageSize = Math.max(Number(req.query.pageSize) || 10, 1);
    pageSize = Math.min(pageSize, 100);

    const status =
        typeof req.query.status === "string" ? req.query.status : undefined;
    const priority =
        typeof req.query.priority === "string" ? req.query.priority : undefined;
    const assignee =
        typeof req.query.assignee === "string" ? req.query.assignee : undefined;
    const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

    const allowedSortFields = ["created_at", "priority", "status", "title"];
    const sortField =
        typeof req.query.sortField === "string" &&
        allowedSortFields.includes(req.query.sortField)
            ? req.query.sortField
            : "created_at";
    const sortDirection =
        req.query.sortDirection === "asc" || req.query.sortDirection === "desc"
            ? req.query.sortDirection
            : "desc";

    const where: any = {};
    if (status) where.status = status;

    if (priority) where.priority = priority;

    if (assignee) where.assignee = assignee;

    if (search) {
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }
    const skip = (page - 1) * pageSize;

    const total = await prisma.tickets.count({ where });
    const tickets = await prisma.tickets.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
            [sortField]: sortDirection,
        },
    });
    const totalPages = Math.ceil(total / pageSize);
    res.status(200).json({
        data: tickets,
        meta: {
            page,
            pageSize,
            total,
            totalPages,
        },
    });
}
