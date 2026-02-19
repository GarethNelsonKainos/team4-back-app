/*
  Warnings:

  - You are about to drop the column `userroleid` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userRole` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_userroleid_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userroleid",
ADD COLUMN     "userRole" TEXT NOT NULL;

-- DropTable
DROP TABLE "userrole";
