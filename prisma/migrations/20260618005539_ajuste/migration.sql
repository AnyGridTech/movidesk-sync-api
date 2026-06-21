/*
  Warnings:

  - You are about to drop the column `decision_at` on the `WarrantyTickets` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `WarrantyTickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WarrantyTickets" DROP COLUMN "decision_at",
DROP COLUMN "result";

-- DropEnum
DROP TYPE "WarrantyResult";
