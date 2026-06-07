/*
  Warnings:

  - A unique constraint covering the columns `[ticket]` on the table `Tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "SystemType" ADD VALUE 'GENERAL';

-- DropIndex
DROP INDEX "Tickets_serialNumber_key";

-- AlterTable
ALTER TABLE "Tickets" ALTER COLUMN "workflow" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_ticket_key" ON "Tickets"("ticket");
