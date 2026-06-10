import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";

class TicketsController {
  async get(req: Request, res: Response) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(1000, Math.max(1, Number(req.query.limit) || 100));
      const skip = (page - 1) * limit;

      const [tickets, total] = await prisma.$transaction([
        prisma.warrantyTickets.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          omit: {
            updatedAt: true,
            createdAt: true,
          },
        }),
        prisma.warrantyTickets.count(),
      ]);

      return res.json({
        data: tickets,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar tickets." });
    }
  }
}

export { TicketsController };