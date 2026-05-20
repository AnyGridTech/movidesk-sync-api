/*
  Warnings:

  - The values [ON_GRID,OFF_GRID,ZERO_GRID,MICRO,HYBRID,CHARGER,BATTERY,DATALOGGER,GENERAL] on the enum `SystemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SystemType_new" AS ENUM ('OFF-GRID', 'ON-GRID', 'GERAL', 'SHINE MASTER', 'MONITORAMENTO', 'ZERO-GRID', 'HIBRIDO');
ALTER TABLE "Tickets" ALTER COLUMN "systemType" TYPE "SystemType_new" USING ("systemType"::text::"SystemType_new");
ALTER TYPE "SystemType" RENAME TO "SystemType_old";
ALTER TYPE "SystemType_new" RENAME TO "SystemType";
DROP TYPE "public"."SystemType_old";
COMMIT;
