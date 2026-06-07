-- CreateEnum
CREATE TYPE "SystemType" AS ENUM ('ON_GRID', 'OFF_GRID');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('ON_TIME', 'LOW_PRIORITY', 'MODERATE', 'HIGH_PRIORITY', 'CRITICAL', 'FINISHED', 'ERROR_DATE_NOT_FOUND');

-- CreateTable
CREATE TABLE "Ticket" (
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

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_serialNumber_key" ON "Ticket"("serialNumber");
