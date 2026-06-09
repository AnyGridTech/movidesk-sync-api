import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";
import * as bcrypt from "bcrypt";
import { Agent } from "node:http";

class Collaborators {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email(),
      name: z.string(),
      department: z.string(),
      position: z.string(),
      passWord: z.string(),
      agent: z.string().nullable(),
    });

    const { email, name, department, position, passWord, agent } =
      bodySchema.parse(req.body);

    const user = await prisma.collaborators.findUnique({
      where: {
        email,
      },
    });

    if (email) {
      res.json("usuario já existe com esse email");
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

    res.json("ola")
  }
}


export {Collaborators}