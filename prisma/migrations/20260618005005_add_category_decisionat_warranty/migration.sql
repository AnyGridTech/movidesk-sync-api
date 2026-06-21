/*
  Warnings:

  - You are about to drop the column `department` on the `Collaborators` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Collaborators` table. All the data in the column will be lost.
  - You are about to drop the column `agent_id` on the `TicketResponse` table. All the data in the column will be lost.
  - Added the required column `channel` to the `TicketResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `TicketResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('EMAIL', 'AGENT', 'BOT', 'DISTRIBUTOR');

-- CreateEnum
CREATE TYPE "WarrantyResult" AS ENUM ('APPROVED', 'DENIED');

-- DropForeignKey
ALTER TABLE "TicketResponse" DROP CONSTRAINT "TicketResponse_agent_id_fkey";

-- AlterTable
ALTER TABLE "Collaborators" DROP COLUMN "department",
DROP COLUMN "position",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'AGENT';

-- AlterTable
ALTER TABLE "TicketResponse" DROP COLUMN "agent_id",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "channel" "Channel" NOT NULL,
ADD COLUMN     "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "WarrantyTickets" ADD COLUMN     "category" TEXT,
ADD COLUMN     "decision_at" TIMESTAMP(3),
ADD COLUMN     "result" "WarrantyResult";

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "score" DECIMAL(2,1) NOT NULL,
    "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "Collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
