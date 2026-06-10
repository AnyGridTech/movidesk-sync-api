import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";
import * as bcrypt from "bcrypt";

class CollaboratorsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      name: z.string(),
      department: z.string(),
      position: z.string(),
      passWord: z.string(),
      agent: z.string().nullable(),
    });




    const { email, name, department, position, passWord, agent } =bodySchema.parse(req.body);

    const userExists = await prisma.collaborators.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ error: "Já existe um usuário com esse e-mail." });
    }

    await prisma.collaborators.create({
      data: {
        name,
        department,
        email,
        passWord: await bcrypt.hash(passWord, 10),
        position,
        agent,
      },
    });

    return res.status(201).json({ message: "Colaborador criado com sucesso." });
  }
}

export { CollaboratorsController };