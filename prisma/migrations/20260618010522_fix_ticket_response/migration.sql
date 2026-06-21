/*
  Warnings:

  - A unique constraint covering the columns `[ticket_id]` on the table `TicketResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TicketResponse" ALTER COLUMN "channel" SET DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX "TicketResponse_ticket_id_key" ON "TicketResponse"("ticket_id");
