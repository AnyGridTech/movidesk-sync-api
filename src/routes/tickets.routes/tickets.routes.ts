import { Router } from "express";
import { TicketsController } from "../../controllers/tickets.controller.js";

const ticketsController = new TicketsController();
const ticketsRouter = Router();


ticketsRouter.get(
  "/tickets/approved",
  ticketsController.approved
);

ticketsRouter.get(
  "/tickets/denied",
  ticketsController.denied
);

export { ticketsRouter };