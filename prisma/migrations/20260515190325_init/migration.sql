/*
  Warnings:

  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SystemType" ADD VALUE 'ZERO_GRID';
ALTER TYPE "SystemType" ADD VALUE 'MICRO';
ALTER TYPE "SystemType" ADD VALUE 'HYBRID';
ALTER TYPE "SystemType" ADD VALUE 'CHARGER';
ALTER TYPE "SystemType" ADD VALUE 'BATTERY';
ALTER TYPE "SystemType" ADD VALUE 'DATALOGGER';

-- DropTable
DROP TABLE "Ticket";

-- CreateTable
CREATE TABLE "Tickets" (
    "id" SERIAL NOT NULL,
    "distributor" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "inverterModel" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "systemType" "SystemType" NOT NULL,
    "error" TEXT,
    "priority" "Priority" NOT NULL,
    "workflow" TEXT NOT NULL,
    "daysOpen" INTEGER NOT NULL DEFAULT 0,
    "warrantyApprovedAt" TIMESTAMP(3),
    "warrantyDeniedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_serialNumber_key" ON "Tickets"("serialNumber");
