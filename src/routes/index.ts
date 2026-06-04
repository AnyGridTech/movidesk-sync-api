import { Router } from "express"
import { Tickets } from "../controllers/SyncTickets.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { ticketsRouter } from "./TicketsRouter/TicketsRouter.js"

const router = Router()
const tickets = new Tickets()

router.get("/tickets/sync", (req, res) => tickets.sync(req, res))
router.use("",authMiddleware,ticketsRouter)
export default router