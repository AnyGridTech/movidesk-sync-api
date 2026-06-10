import { Router } from "express";
import { CollaboratorsController } from "../../controllers/collaborators.controller.js";


const CollaboratorsRouter = new CollaboratorsController()
const collaboratorstRouter = Router()

collaboratorstRouter.post("/collaborators",CollaboratorsRouter.create)

export {collaboratorstRouter}