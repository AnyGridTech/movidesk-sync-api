import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";

class TicketsController {
  // ============================================================
  // GARANTIAS
  // ============================================================

  async approved(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: "startDate e endDate são obrigatórios.",
        });
      }

      const start = new Date(`${startDate}T00:00:00.000`);
      const end = new Date(`${endDate}T23:59:59.999`);

      const tickets = await prisma.warrantyTickets.findMany({
        where: {
          warrantyApprovedAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          warrantyApprovedAt: "desc",
        },
      });

      return res.json(tickets);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar garantias aprovadas.",
      });
    }
  }

  async denied(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: "startDate e endDate são obrigatórios.",
        });
      }

      const start = new Date(`${startDate}T00:00:00.000`);
      const end = new Date(`${endDate}T23:59:59.999`);

      const tickets = await prisma.warrantyTickets.findMany({
        where: {
          warrantyDeniedAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          warrantyDeniedAt: "desc",
        },
      });

      return res.json(tickets);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar garantias negadas.",
      });
    }
  }

  // ============================================================
  // TICKETS DE RESPOSTA — POR TIME
  // ============================================================

  /**
   * GET /tickets/responses
   * Retorna todos os tickets de resposta salvos no banco.
   */
  async allResponses(req: Request, res: Response) {
    try {
      const tickets = await prisma.ticketResponse.findMany({
        orderBy: { openedAt: "desc" },
      });

      return res.json({
        total: tickets.length,
        tickets,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar tickets.",
      });
    }
  }

  /**
   * GET /tickets/responses/by-team
   * Retorna os tickets agrupados por time:
   *   - email       → team = 'Email'
   *   - inversor    → team = 'Equipe Inversor'
   *   - monitoramento → team = 'Equipe Monitoramento'
   *
   * Query params opcionais:
   *   - startDate (YYYY-MM-DD)
   *   - endDate   (YYYY-MM-DD)
   */
  async responsesByTeam(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const dateFilter =
        startDate && endDate
          ? {
              openedAt: {
                gte: new Date(`${startDate}T00:00:00.000`),
                lte: new Date(`${endDate}T23:59:59.999`),
              },
            }
          : {};

      const [email, inversor, monitoramento] = await Promise.all([
        prisma.ticketResponse.findMany({
          where: { team: "Email", ...dateFilter },
          orderBy: { openedAt: "desc" },
        }),
        prisma.ticketResponse.findMany({
          where: { team: "Equipe Inversor", ...dateFilter },
          orderBy: { openedAt: "desc" },
        }),
        prisma.ticketResponse.findMany({
          where: { team: "Equipe Monitoramento", ...dateFilter },
          orderBy: { openedAt: "desc" },
        }),
      ]);

      return res.json({
        totais: {
          email: email.length,
          inversor: inversor.length,
          monitoramento: monitoramento.length,
          geral: email.length + inversor.length + monitoramento.length,
        },
        email,
        inversor,
        monitoramento,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar tickets por time.",
      });
    }
  }
}

export { TicketsController };