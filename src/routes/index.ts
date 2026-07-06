import { Router } from "express";
import { SyncTicketsController } from "../controllers/sync-tickets.controller.js";

import { ticketsRouter } from "./tickets.routes/tickets.routes.js";

import { collaboratorstRouter } from "./collaborators.routes/collaborators.routes.js";
import { authenticationHandling } from "../middlewares/authenticationHandling.js";
import { loginRouter } from "./Login/login.route.js";
import { boss } from "../jobs/syncJob.js";

const router = Router();
const tickets = new SyncTicketsController();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


router.use("",loginRouter)
router.use(authenticationHandling)
router.use("", collaboratorstRouter)
router.use("", ticketsRouter);


router.get("/tickets/sync", async (req, res) => {
  try {
    const jobId = await boss.send("sync-tickets", {}, { singletonKey: "sync-tickets" });

    if (!jobId) {
      return res.status(409).json({
        message: "Já existe uma sincronização em andamento. Tente novamente em alguns minutos.",
      });
    }

    return res.status(202).json({
      message: "Sincronização enfileirada",
      jobId,
    });
  } catch (error) {
    console.error("Erro ao enfileirar sync:", error);
    return res.status(500).json({
      message: "Erro ao enfileirar sincronização",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
export default router;