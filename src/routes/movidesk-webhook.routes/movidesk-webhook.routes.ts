import { Router } from "express";
import { MovideskWebhookController } from "../../controllers/movidesk-webhook.controller.js";

const MovideskWebhookRouter = new MovideskWebhookController();
const movideskWebhookRouters = Router();

movideskWebhookRouters.post("/webhook",  (req, res) =>
  MovideskWebhookRouter.create(req, res),
);

export { movideskWebhookRouters };
