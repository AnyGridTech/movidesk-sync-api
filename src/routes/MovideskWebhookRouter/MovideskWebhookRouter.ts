import { Router } from "express";
import { MovideskWebhook } from "../../controllers/MovideskWebhook.js";

const MovideskWebhookRouter = new MovideskWebhook();
const movideskWebhookRouters = Router();

movideskWebhookRouters.post("/webhook",  (req, res) =>
  MovideskWebhookRouter.create(req, res),
);

export { movideskWebhookRouters };
