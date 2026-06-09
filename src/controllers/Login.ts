import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";


class Login{
    async login(req:Request,res: Response){
        const bodySchema = z.object({
            email : z.email({message: "formato de email incorreto"}),
            password : z.string({message:"preencher a senha"})
        })


        const {email, password} = bodySchema.parse(req.body)

        const user = await prisma.collaborators.findUnique({
            where:{
                email
            }
        })

        if(!email){
            res.json("usuario ou senha invalido")
        }


    }
}