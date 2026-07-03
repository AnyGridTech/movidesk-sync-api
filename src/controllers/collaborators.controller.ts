import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";
import bcrypt from "bcrypt";

class CollaboratorsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email(),
      name: z.string(),
      passWord: z.string(),
      role: z.enum(["AGENT", "SUPERVISOR"]).default("AGENT")
    });

    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, name, passWord,  role } = parsed.data;

    const userExists = await prisma.collaborators.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ error: "Já existe um usuário com esse e-mail." });
    }

    await prisma.collaborators.create({
      data: {
        name,
        email,
        passWord: await bcrypt.hash(passWord, 10),
        role,
      },
    });

    return res.status(201).json({ message: "Colaborador criado com sucesso." });
  }
}

export { CollaboratorsController };