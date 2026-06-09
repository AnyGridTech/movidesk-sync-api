import { Router } from "express";
import { Tickets } from "../controllers/SyncTickets.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ticketsRouter } from "./TicketsRouter/TicketsRouter.js";
import { movideskWebhookRouters } from "./MovideskWebhookRouter/MovideskWebhookRouter.js";
import { authMiddlewareWebHook } from "../middlewares/authMiddlewareWebHook.js";
import { collaboratorstRouter } from "./CollaboratorsRouter/CollaboratorsRouter.js";

const router = Router();
const tickets = new Tickets();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("", collaboratorstRouter)
router.use("", authMiddlewareWebHook, movideskWebhookRouters);
router.use(authMiddleware);
router.use("", ticketsRouter);

router.get("/tickets/sync", (req, res) => tickets.sync(req, res));
export default router;
