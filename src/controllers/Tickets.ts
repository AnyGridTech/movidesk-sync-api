import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";

class Tickets {
  async get(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;
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
  }
}

export { Tickets };
