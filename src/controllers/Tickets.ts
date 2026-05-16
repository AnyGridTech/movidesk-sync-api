import type { Request, Response } from "express";
import { api } from "../api/MovideskAPI.js";
import type { MovideskTicket } from "../types/MovideskTicket.js";
import { prisma } from "../client/prisma.js";

const getFieldValue = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.value ?? null;

const getFieldItem = (ticket: MovideskTicket, fieldId: number) =>
  ticket.customFieldValues?.find((f) => f.customFieldId === fieldId)?.items?.[0]?.customFieldItem ?? null;

class Tickets {
  async sync(req: Request, res: Response) {
    const PAGE_SIZE = 1000;
    let skip = 0;
    let totalSaved = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await api.get<MovideskTicket[]>("/tickets", {
          params: {
            token: process.env.MOVIDESK_TOKEN,
            $select: "id,status,createdDate,customFieldValues",
            $expand: "customFieldValues($expand=items)",
            $filter: "category eq 'Garantia' and createdDate ge 2026-01-01T00:00:00Z and createdDate le 2026-12-31T23:59:59Z",
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

        console.log(`skip=${skip} | retornados: ${tickets.length}`);

        for (const ticket of tickets) {
          const serialNumber       = getFieldValue(ticket, 92408);
          const ticketId           = ticket.id;
          const distributor        = getFieldItem(ticket, 92834);
          const state              = getFieldItem(ticket, 92993);
          const inverterModel      = getFieldItem(ticket, 152179);
          const error              = getFieldItem(ticket, 144016);
          const workflow           = getFieldItem(ticket, 215335) ?? ticket.status;
          const warrantyApprovedAt = getFieldValue(ticket, 107733);
          const warrantyDeniedAt   = getFieldValue(ticket, 117072);

          if (!serialNumber) {
            console.log(`Ticket ${ticket.id} sem serial number, pulando...`);
            continue;
          }

          await prisma.tickets.upsert({
            where: { serialNumber },
            update: {
              distributor:         distributor    ?? "",
              state:               state          ?? "",
              inverterModel:       inverterModel  ?? "",
              error:               error,
              workflow:            workflow,
              warrantyApprovedAt:  warrantyApprovedAt ? new Date(warrantyApprovedAt) : null,
              warrantyDeniedAt:    warrantyDeniedAt   ? new Date(warrantyDeniedAt)   : null,
            },
            create: {
              ticket:              ticketId,
              serialNumber,
              distributor:         distributor    ?? "",
              state:               state          ?? "",
              inverterModel:       inverterModel  ?? "",
              error:               error,
              workflow:            workflow,
              systemType:          "ON_GRID",
              priority:            "ON_TIME",
              warrantyApprovedAt:  warrantyApprovedAt ? new Date(warrantyApprovedAt) : null,
              warrantyDeniedAt:    warrantyDeniedAt   ? new Date(warrantyDeniedAt)   : null,
            },
          });

          totalSaved++;
        }

        console.log(`skip=${skip} | salvos até agora: ${totalSaved}`);

        if (tickets.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          skip += PAGE_SIZE;
        }
      }

      return res.json({ message: "Sync concluído", totalSaved });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao sincronizar tickets",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export { Tickets };