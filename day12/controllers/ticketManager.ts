import prisma from "../prisma/prisma";
import type {
    ticketsCreateInput,
    ticketsUpdateInput,
} from "../generated/prisma/models";

export async function getTickets() {
    return await prisma.tickets.findMany();
}

export async function getTicketById(id: number) {
    return await prisma.tickets.findUnique({
        where: { ticket_id: id },
    });
}

export async function deleteTicket(id: number): Promise<boolean> {
    try {
        await prisma.tickets.delete({
            where: { ticket_id: id },
        });
        return true;
    } catch {
        return false;
    }
}

export async function addTicket(ticket: ticketsCreateInput) {
    return await prisma.tickets.create({
        data: ticket,
    });
}

export async function updateTicket(id: number, updates: ticketsUpdateInput) {
    try {
        return await prisma.tickets.update({
            where: { ticket_id: id },
            data: updates,
        });
    } catch {
        return null;
    }
}

export async function assignTicket(id: number, user_id: number) {
    return await prisma.assignments.upsert({
        where: {
            ticket_id_user_id: {
                ticket_id: id,
                user_id,
            },
        },
        update: {},
        create: {
            ticket_id: id,
            user_id,
        },
    });
}
