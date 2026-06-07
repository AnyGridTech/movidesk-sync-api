/*
  Warnings:

  - You are about to drop the `Tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tickets";

-- DropEnum
DROP TYPE "OpenedBy";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "SystemType";

-- CreateTable
CREATE TABLE "WarrantyTickets" (
    "id" SERIAL NOT NULL,
    "ticket" INTEGER NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "warrantyApprovedAt" TIMESTAMP(3),
    "warrantyDeniedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarrantyTickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WarrantyTickets_ticket_key" ON "WarrantyTickets"("ticket");
