/*
  Warnings:

  - You are about to drop the column `userrole` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "band" ALTER COLUMN "bandname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "capability" ALTER COLUMN "capabilityname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userrole";
