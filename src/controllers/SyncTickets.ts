import type { Request, Response } from "express";
import { api } from "../api/MovideskAPI.js";
import type { MovideskTicket } from "../types/MovideskTicket.js";
import { prisma } from "../client/prisma.js";
import { calcPriority } from "../utils/calcPriority.js";
import { calcDaysOpen } from "../utils/calcDaysOpen.js";

const getFieldValue = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.value ??
  null;

const getFieldItem = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.items?.[0]
    ?.customFieldItem ?? null;

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
        $filter:
          "((category eq 'Garantia') or (category eq 'Fora da Garantia')) and createdDate ge 2026-01-01T00:00:00Z and createdDate le 2026-12-31T23:59:59Z",
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

    for (const ticket of tickets) {
      const serialNumber = getFieldValue(ticket, 92408);
      const ticketId = ticket.id;
      const warrantyApprovedAt = getFieldValue(ticket, 107733);
      const warrantyDeniedAt = getFieldValue(ticket, 243250);

      if (!serialNumber || serialNumber === "XXXXXXXXXX") {
        continue;
      }

      console.log("regsitro criado" + ticket.id);

      await prisma.warrantyTickets.upsert({
        where: { ticket: ticketId },
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
          ticket: ticketId,
          serialNumber,
          warrantyApprovedAt: warrantyApprovedAt
            ? new Date(warrantyApprovedAt)
            : null,
          warrantyDeniedAt: warrantyDeniedAt
            ? new Date(warrantyDeniedAt)
            : null,
        },
      });

      totalSaved++;
    }

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
