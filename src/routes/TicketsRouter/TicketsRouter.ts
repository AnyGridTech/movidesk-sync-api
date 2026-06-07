import { Router } from "express";
import { Tickets } from "../../controllers/Tickets.js";

const TicketsRouter = new Tickets()
const ticketsRouter = Router()

ticketsRouter.get("/tickets",TicketsRouter.get)

export {ticketsRouter}