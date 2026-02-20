/*
  Warnings:

  - Changed the type of `applicationstatus` on the `applications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "cvurl" SET DATA TYPE TEXT,
DROP COLUMN "applicationstatus",
ADD COLUMN     "applicationstatus" TEXT NOT NULL;

-- DropEnum
DROP TYPE "application_status";
