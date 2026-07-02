import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";


const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function getPagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(req.query.pageSize) || DEFAULT_PAGE_SIZE)
  );
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

function buildPaginationMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1,
  };
}

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

      const { page, pageSize, skip } = getPagination(req);

      const where = {
        warrantyApprovedAt: {
          gte: start,
          lte: end,
        },
      };

      const [tickets, total] = await Promise.all([
        prisma.warrantyTickets.findMany({
          where,
          orderBy: { warrantyApprovedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.warrantyTickets.count({ where }),
      ]);

      return res.json({
        ...buildPaginationMeta(total, page, pageSize),
        tickets,
      });
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

      const { page, pageSize, skip } = getPagination(req);

      const where = {
        warrantyDeniedAt: {
          gte: start,
          lte: end,
        },
      };

      const [tickets, total] = await Promise.all([
        prisma.warrantyTickets.findMany({
          where,
          orderBy: { warrantyDeniedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.warrantyTickets.count({ where }),
      ]);

      return res.json({
        ...buildPaginationMeta(total, page, pageSize),
        tickets,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar garantias negadas.",
      });
    }
  }


  async allResponses(req: Request, res: Response) {
    try {
      const { page, pageSize, skip } = getPagination(req);

      const [tickets, total] = await Promise.all([
        prisma.ticketResponse.findMany({
          orderBy: { openedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.ticketResponse.count(),
      ]);

      return res.json({
        ...buildPaginationMeta(total, page, pageSize),
        tickets,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar tickets.",
      });
    }
  }

  async responsesByTeam(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const { page, pageSize, skip } = getPagination(req);

      const dateFilter =
        startDate && endDate
          ? {
              openedAt: {
                gte: new Date(`${startDate}T00:00:00.000`),
                lte: new Date(`${endDate}T23:59:59.999`),
              },
            }
          : {};

      const whereEmail = { team: "Email", ...dateFilter };
      const whereInversor = { team: "Equipe Inversor", ...dateFilter };
      const whereMonitoramento = { team: "Equipe Monitoramento", ...dateFilter };

      const [
        email,
        inversor,
        monitoramento,
        totalEmail,
        totalInversor,
        totalMonitoramento,
      ] = await Promise.all([
        prisma.ticketResponse.findMany({
          where: whereEmail,
          orderBy: { openedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.ticketResponse.findMany({
          where: whereInversor,
          orderBy: { openedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.ticketResponse.findMany({
          where: whereMonitoramento,
          orderBy: { openedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.ticketResponse.count({ where: whereEmail }),
        prisma.ticketResponse.count({ where: whereInversor }),
        prisma.ticketResponse.count({ where: whereMonitoramento }),
      ]);

      const totalGeral = totalEmail + totalInversor + totalMonitoramento;

      return res.json({
        page,
        pageSize,
        totais: {
          email: totalEmail,
          inversor: totalInversor,
          monitoramento: totalMonitoramento,
          geral: totalGeral,
        },
        email: {
          ...buildPaginationMeta(totalEmail, page, pageSize),
          tickets: email,
        },
        inversor: {
          ...buildPaginationMeta(totalInversor, page, pageSize),
          tickets: inversor,
        },
        monitoramento: {
          ...buildPaginationMeta(totalMonitoramento, page, pageSize),
          tickets: monitoramento,
        },
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