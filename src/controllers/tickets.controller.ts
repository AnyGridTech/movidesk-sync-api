import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";

class TicketsController {
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
}

export { TicketsController };