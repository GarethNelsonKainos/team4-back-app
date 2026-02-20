/*
  Warnings:

  - A unique constraint covering the columns `[rolename]` on the table `jobroles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jobroles_rolename_key" ON "jobroles"("rolename");
