/*
  Warnings:

  - Added the required column `openedBy` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OpenedBy" AS ENUM ('EMAIL', 'BOT', 'DISTRIBUTOR', 'AGENT');

-- AlterTable
ALTER TABLE "Tickets" ADD COLUMN     "openedBy" "OpenedBy" NOT NULL;
