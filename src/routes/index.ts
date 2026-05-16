import { Router } from "express"
import { Tickets } from "../controllers/Tickets.js"

const router = Router()
const tickets = new Tickets()

router.get("/tickets/sync", (req, res) => tickets.sync(req, res))

export default router