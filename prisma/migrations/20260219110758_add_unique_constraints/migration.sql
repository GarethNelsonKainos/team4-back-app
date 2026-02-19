/*
  Warnings:

  - A unique constraint covering the columns `[bandname]` on the table `band` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[capabilityname]` on the table `capability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rolename]` on the table `jobroles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "band_bandname_key" ON "band"("bandname");

-- CreateIndex
CREATE UNIQUE INDEX "capability_capabilityname_key" ON "capability"("capabilityname");

-- CreateIndex
CREATE UNIQUE INDEX "jobroles_rolename_key" ON "jobroles"("rolename");
