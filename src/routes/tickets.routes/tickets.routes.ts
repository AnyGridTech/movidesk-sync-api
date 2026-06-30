import { Router } from "express";
import { TicketsController } from "../../controllers/tickets.controller.js";

const ticketsController = new TicketsController();
const ticketsRouter = Router();

// Garantias
ticketsRouter.get("/tickets/approved", ticketsController.approved);
ticketsRouter.get("/tickets/denied", ticketsController.denied);

// Tickets de resposta
ticketsRouter.get("/tickets/responses", ticketsController.allResponses);
ticketsRouter.get("/tickets/responses/by-team", ticketsController.responsesByTeam);

export { ticketsRouter };