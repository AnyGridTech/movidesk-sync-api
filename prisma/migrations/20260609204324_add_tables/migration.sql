/*
  Warnings:

  - You are about to drop the `Agents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketResponse" DROP CONSTRAINT "TicketResponse_agent_id_fkey";

-- DropTable
DROP TABLE "Agents";

-- CreateTable
CREATE TABLE "Collaborators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passWord" TEXT NOT NULL,
    "agent" TEXT,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborators_email_key" ON "Collaborators"("email");

-- AddForeignKey
ALTER TABLE "TicketResponse" ADD CONSTRAINT "TicketResponse_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
