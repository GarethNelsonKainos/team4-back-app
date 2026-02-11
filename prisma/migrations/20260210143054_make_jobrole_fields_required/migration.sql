/*
  Warnings:

  - Made the column `rolename` on table `jobroles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joblocation` on table `jobroles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `closingdate` on table `jobroles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobroles" ALTER COLUMN "rolename" SET NOT NULL,
ALTER COLUMN "joblocation" SET NOT NULL,
ALTER COLUMN "closingdate" SET NOT NULL;
