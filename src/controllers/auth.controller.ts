import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface TokenPayLoad {
  id: string;
  role: string;
}

class AuthController {
  async login(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email({ message: "Formato de e-mail incorreto." }),
      passWord: z.string({ message: "Senha é obrigatória." }),
    });

    const { email, passWord } = bodySchema.parse(req.body);

    const colaborador = await prisma.collaborators.findUnique({
      where: { email },
    });

    if (!colaborador) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await bcrypt.compare(passWord, colaborador.passWord);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    if (!process.env.API_GROWATT_TOKEN) {
      return res
        .status(500)
        .json({ error: "Erro interno de autenticação. Contate o suporte." });
    }

    const payload: TokenPayLoad = {
      id: colaborador.id,
      role : colaborador.role
    };

    const token = jwt.sign(payload, process.env.API_GROWATT_TOKEN, {
      expiresIn: "1d",
    });

    const { passWord: _, ...colaboradorSemSenha } = colaborador;

    return res.status(200).json({ token, user: colaboradorSemSenha });
  }
}

export { AuthController };
