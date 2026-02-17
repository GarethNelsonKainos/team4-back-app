/*
  Warnings:

  - A unique constraint covering the columns `[bandname]` on the table `band` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[capabilityname]` on the table `capability` will be added. If there are existing duplicate values, this will fail.
  - Made the column `bandname` on table `band` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capabilityname` on table `capability` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "band" ALTER COLUMN "bandname" SET NOT NULL;

-- AlterTable
ALTER TABLE "capability" ALTER COLUMN "capabilityname" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "band_bandname_key" ON "band"("bandname");

-- CreateIndex
CREATE UNIQUE INDEX "capability_capabilityname_key" ON "capability"("capabilityname");
