import type { Request, Response } from "express";
import { api } from "../api/MovideskAPI.js";
import type { MovideskTicket } from "../types/MovideskTicket.js";
import { prisma } from "../client/prisma.js";

const CHUNK_SIZE = 10;


const getFieldValue = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.value ??
  null;


function buildWarrantyFilter(): string {
  const year = new Date().getFullYear();
  return (
    `((category eq 'Garantia') or (category eq 'Fora da Garantia'))` +
    ` and createdDate ge ${year}-01-01T00:00:00Z` +
    ` and createdDate le ${year}-12-31T23:59:59Z`
  );
}

async function upsertWarrantyChunks(tickets: MovideskTicket[]): Promise<number> {
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
        const category = ticket.category ?? null;

        return prisma.warrantyTickets.upsert({
          where: { ticket: ticket.id },
          update: {
            serialNumber,
            category,
            warrantyApprovedAt: warrantyApprovedAt ? new Date(warrantyApprovedAt) : null,
            warrantyDeniedAt: warrantyDeniedAt ? new Date(warrantyDeniedAt) : null,
          },
          create: {
            ticket: ticket.id,
            serialNumber,
            category,
            warrantyApprovedAt: warrantyApprovedAt ? new Date(warrantyApprovedAt) : null,
            warrantyDeniedAt: warrantyDeniedAt ? new Date(warrantyDeniedAt) : null,
          },
        });
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") saved++;
      else console.error("Falha no upsert de garantia:", result.reason);
    }
  }

  return saved;
}

async function syncWarranties(): Promise<number> {
  const PAGE_SIZE = 400;
  let skip = 0;
  let total = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await api.get<MovideskTicket[]>("/tickets", {
      params: {
        token: process.env.MOVIDESK_TOKEN,
        $select: "id,status,createdDate,category,customFieldValues,origin",
        $expand: "customFieldValues($expand=items)",
        $filter: buildWarrantyFilter(),
        $orderby: "id asc",
        $top: PAGE_SIZE,
        $skip: skip,
      },
    });

    const tickets: MovideskTicket[] = response.data;

    if (!Array.isArray(tickets) || tickets.length === 0) break;

    total += await upsertWarrantyChunks(tickets);

    if (tickets.length < PAGE_SIZE) hasMore = false;
    else skip += PAGE_SIZE;
  }

  return total;
}


function buildTicketFilter(): string {
  return (
    `justification eq 'Aguardando Retorno da Growatt' and ownerTeam eq 'Equipe Inversor'`
  );
}

async function upsertTicketChunks(tickets: MovideskTicket[]): Promise<number> {
  let processed = 0;

  for (let i = 0; i < tickets.length; i += CHUNK_SIZE) {
    const chunk = tickets.slice(i, i + CHUNK_SIZE);

    const results = await Promise.allSettled(
      chunk.map((ticket) =>
        prisma.ticketResponse.upsert({
          where: { ticketId: String(ticket.id) },
          update: {
            title: ticket.subject ?? null,
            category: ticket.category ?? null,
            status: "WAITING",
            openedAt: new Date(ticket.createdDate),
          },
          create: {
            ticketId: String(ticket.id),
            title: ticket.subject ?? null,
            category: ticket.category ?? null,
            status: "WAITING",
            openedAt: new Date(ticket.createdDate),
          },
        })
      )
    );

    for (const result of results) {
      if (result.status === "fulfilled") processed++;
      else console.error("Falha no upsert de ticket:", result.reason);
    }
  }

  return processed;
}

async function syncTicketResponses(): Promise<number> {
  const PAGE_SIZE = 400;
  let skip = 0;
  let total = 0;
  let hasMore = true;
  const idsAtuais = new Set<string>();

  while (hasMore) {
    const response = await api.get<MovideskTicket[]>("/tickets", {
      params: {
        token: process.env.MOVIDESK_TOKEN,
        $select: "id,subject,status,justification,category,createdDate",
        $filter: buildTicketFilter(),
        $orderby: "id asc",
        $top: PAGE_SIZE,
        $skip: skip,
      },
    });

    const tickets: MovideskTicket[] = response.data;

    if (!Array.isArray(tickets) || tickets.length === 0) break;

    for (const ticket of tickets) {
      idsAtuais.add(String(ticket.id));
    }

    total += await upsertTicketChunks(tickets);

    if (tickets.length < PAGE_SIZE) hasMore = false;
    else skip += PAGE_SIZE;
  }

  // remove do banco quem não está mais "aguardando Growatt"
  await prisma.ticketResponse.deleteMany({
    where: {
      ticketId: { notIn: Array.from(idsAtuais) },
    },
  });

  return total;
}

class SyncTicketsController {
  async sync(req: Request, res: Response) {
    try {
      // roda os dois em paralelo
      const [warranties, ticketResponses] = await Promise.all([
        syncWarranties(),
        syncTicketResponses(),
      ]);

      return res.json({
        message: "Sync concluído",
        warranties,
        ticketResponses,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao sincronizar",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
export { SyncTicketsController, syncWarranties, syncTicketResponses };