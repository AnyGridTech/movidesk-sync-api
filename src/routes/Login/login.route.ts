import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller.js";



const LoginRouter = new AuthController()
const loginRouter = Router()

loginRouter.post("/login",LoginRouter.login)

export {loginRouter}