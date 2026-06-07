import type { Request, Response } from "express";
import { prisma } from "../client/prisma.js";
import type { MovideskWebhookPayload } from "../types/MovideskWebhookPayload.js";

class MovideskWebhook {
  async create(req: Request, res: Response) {
    res.sendStatus(200);

    try {
      const payload = req.body as MovideskWebhookPayload;

      const lastAction = payload.Actions[payload.Actions.length - 1];

      if (!lastAction?.CreatedBy?.Id) {
        return;
      }

      const agentId = lastAction.CreatedBy.Id;

      const agentExists = await prisma.agents.findUnique({
        where: { id: agentId },
      });

      if (!agentExists) {
        return;
      }

      await prisma.ticketResponse.create({
        data: {
          ticketId: String(payload.Id),
          agentId,
        },
      });
    } catch (error) { console.error("Erro no webhook:", error)}
  }
}

export { MovideskWebhook };
