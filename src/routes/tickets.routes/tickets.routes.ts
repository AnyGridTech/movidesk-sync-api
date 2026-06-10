import { Router } from "express";
import { TicketsController } from "../../controllers/tickets.controller.js";

const TicketsRouter = new TicketsController();
const ticketsRouter = Router();

ticketsRouter.get("/tickets", TicketsRouter.get);

export { ticketsRouter };
