import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../client/prisma.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface TokenPayLoad {
  id: string;
  position: string;
  department: string;
}

class AuthController {
  async login(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email({ message: "Formato de e-mail incorreto." }),
      password: z.string({ message: "Senha é obrigatória." }),
    });

    const { email, password } = bodySchema.parse(req.body);

    const colaborador = await prisma.collaborators.findUnique({
      where: { email },
    });

    if (!colaborador) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await bcrypt.compare(password, colaborador.passWord);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    if (!process.env.SECRET_KEY_TOKEN) {
      return res
        .status(500)
        .json({ error: "Erro interno de autenticação. Contate o suporte." });
    }

    const payload: TokenPayLoad = {
      id: colaborador.id,
      position: colaborador.position,
      department: colaborador.department,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "10m",
    });

    const { passWord: _, ...colaboradorSemSenha } = colaborador;

    return res.status(200).json({ token, user: colaboradorSemSenha });
  }
}

export { AuthController };
