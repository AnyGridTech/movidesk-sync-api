import { Router } from "express";
import { Collaborators } from "../../controllers/Collaborators.js";


const CollaboratorsRouter = new Collaborators()
const collaboratorstRouter = Router()

collaboratorstRouter.post("/collaborators",CollaboratorsRouter.create)

export {collaboratorstRouter}