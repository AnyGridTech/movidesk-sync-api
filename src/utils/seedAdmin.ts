import * as bcrypt from "bcrypt";
import { prisma } from "../client/prisma.js";
import { Role } from "../generated/prisma/enums.js";


export async function seedAdmin() {
  const totalUsuarios = await prisma.collaborators.count();

  if (totalUsuarios > 0) {
    return;
  }

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.collaborators.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passWord: hashedPassword,
      role: Role.SUPERVISOR,
    },
  });

}