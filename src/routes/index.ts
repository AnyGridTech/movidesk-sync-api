import { Router } from "express";
import { SyncTicketsController } from "../controllers/sync-tickets.controller.js";

import { ticketsRouter } from "./tickets.routes/tickets.routes.js";

import { collaboratorstRouter } from "./collaborators.routes/collaborators.routes.js";
import { authenticationHandling } from "../middlewares/authenticationHandling.js";
import { loginRouter } from "./Login/login.route.js";

const router = Router();
const tickets = new SyncTicketsController();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("", ticketsRouter);

router.use("",loginRouter)
router.use(authenticationHandling)
router.use("", collaboratorstRouter)

router.get("/tickets/sync", (req, res) => tickets.sync(req, res));
export default router;