import { Router } from "express";
import { Tickets } from "../controllers/sync-tickets.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ticketsRouter } from "./tickets.routes/tickets.routes.js";
import { movideskWebhookRouters } from "./movidesk-webhook.routes/movidesk-webhook.routes.js";
import { authMiddlewareWebHook } from "../middlewares/authMiddlewareWebHook.js";
import { collaboratorstRouter } from "./collaborators.routes/collaborators.routes.js";

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
