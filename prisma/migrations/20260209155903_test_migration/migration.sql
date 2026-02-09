/*
  Warnings:

  - The `bandName` column on the `Band` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "band" DROP COLUMN "bandname",
ADD COLUMN     "bandName" INTEGER;
