import type { Request, Response } from "express";
import { api } from "../api/MovideskAPI.js";
import type { MovideskTicket } from "../types/MovideskTicket.js";
import { prisma } from "../client/prisma.js";

const CHUNK_SIZE = 10;

const getFieldValue = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.value ??
  null;

const getFieldItem = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.items?.[0]
    ?.customFieldItem ?? null;
function buildDateFilter(): string {
  const year = new Date().getFullYear();
  return (
    `((category eq 'Garantia') or (category eq 'Fora da Garantia'))` +
    ` and createdDate ge ${year}-01-01T00:00:00Z` +
    ` and createdDate le ${year}-12-31T23:59:59Z`
  );
}

async function upsertChunks(tickets: MovideskTicket[]): Promise<number> {
  const valid = tickets.filter((ticket) => {
    const serialNumber = getFieldValue(ticket, 92408);
    return serialNumber && serialNumber !== "XXXXXXXXXX";
  });

  let saved = 0;

  for (let i = 0; i < valid.length; i += CHUNK_SIZE) {
    const chunk = valid.slice(i, i + CHUNK_SIZE);

    const results = await Promise.allSettled(
      chunk.map((ticket) => {
        const serialNumber = getFieldValue(ticket, 92408)!;
        const warrantyApprovedAt = getFieldValue(ticket, 107733);
        const warrantyDeniedAt = getFieldValue(ticket, 243250);

        console.log("registro criado: " + ticket.id);

        return prisma.warrantyTickets.upsert({
          where: { ticket: ticket.id },
          update: {
            serialNumber,
            warrantyApprovedAt: warrantyApprovedAt
              ? new Date(warrantyApprovedAt)
              : null,
            warrantyDeniedAt: warrantyDeniedAt
              ? new Date(warrantyDeniedAt)
              : null,
          },
          create: {
            ticket: ticket.id,
            serialNumber,
            warrantyApprovedAt: warrantyApprovedAt
              ? new Date(warrantyApprovedAt)
              : null,
            warrantyDeniedAt: warrantyDeniedAt
              ? new Date(warrantyDeniedAt)
              : null,
          },
        });
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        saved++;
      } else {
        console.error("Falha no upsert:", result.reason);
      }
    }
  }

  return saved;
}

export async function syncTickets() {
  const PAGE_SIZE = 400;
  let skip = 0;
  let totalSaved = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await api.get<MovideskTicket[]>("/tickets", {
      params: {
        token: process.env.MOVIDESK_TOKEN,
        $select: "id,status,createdDate,customFieldValues,origin",
        $expand: "customFieldValues($expand=items)",
        $filter: buildDateFilter(), // FIX 2
        $orderby: "id asc",
        $top: PAGE_SIZE,
        $skip: skip,
      },
    });

    const tickets: MovideskTicket[] = response.data;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      hasMore = false;
      break;
    }

    totalSaved += await upsertChunks(tickets); 

    if (tickets.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      skip += PAGE_SIZE;
    }
  }

  return totalSaved;
}

class Tickets {
  async sync(req: Request, res: Response) {
    try {
      const totalSaved = await syncTickets();
      return res.json({ message: "Sync concluído", totalSaved });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao sincronizar tickets",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export { Tickets };